import smartpy as sp

# FA2 standard for NFT minting on Tezos
# Fixed price: 5 tez per mint
# Vaporwave Nature Collection

@sp.module
def main():
    # FA2 Error types
    class FA2ErrorMessage:
        PREFIX = "FA2_"
        TOKEN_UNDEFINED = f"{PREFIX}TOKEN_UNDEFINED"
        INSUFFICIENT_BALANCE = f"{PREFIX}INSUFFICIENT_BALANCE"
        NOT_OWNER = f"{PREFIX}NOT_OWNER"
        NOT_OPERATOR = f"{PREFIX}NOT_OPERATOR"
        OPERATORS_UNSUPPORTED = f"{PREFIX}OPERATORS_UNSUPPORTED"

    class VaporwaveNature(sp.Contract):
        def __init__(self, admin, metadata_base_uri):
            self.data.admin = admin
            self.data.ledger = sp.big_map()  # token_id -> owner
            self.data.token_metadata = sp.big_map()  # token_id -> metadata
            self.data.operators = sp.big_map()  # (owner, operator, token_id) -> unit
            self.data.next_token_id = 0
            self.data.max_supply = 100  # Adjust as needed
            self.data.mint_price = sp.tez(5)
            self.data.paused = False
            self.data.metadata_base_uri = metadata_base_uri
            
            # Contract metadata for indexers
            self.data.metadata = sp.big_map({
                "": sp.bytes("0x74657a6f732d73746f726167653a64617461"),
                "data": sp.utils.bytes_of_string('{"name":"Vaporwave Nature","description":"Generative crystals, mountains, and water in vaporwave aesthetic","interfaces":["TZIP-012","TZIP-016"]}')
            })
        
        @sp.entrypoint
        def mint(self):
            """Public minting at 5 tez per token"""
            assert not self.data.paused, "MINTING_PAUSED"
            assert self.data.next_token_id < self.data.max_supply, "MAX_SUPPLY_REACHED"
            assert sp.amount == self.data.mint_price, "INCORRECT_PAYMENT"
            
            # Generate token hash from blockchain data
            token_hash = sp.pack((
                sp.sender,
                sp.level,
                sp.now,
                self.data.next_token_id
            ))
            
            # Create metadata URI pointing to IPFS
            token_uri = sp.concat([
                self.data.metadata_base_uri,
                sp.utils.bytes_of_string("/"),
                sp.utils.bytes_of_string(sp.utils.nat_to_string(self.data.next_token_id)),
                sp.utils.bytes_of_string(".json")
            ])
            
            # Mint token
            self.data.ledger[self.data.next_token_id] = sp.sender
            self.data.token_metadata[self.data.next_token_id] = sp.record(
                token_id=self.data.next_token_id,
                token_info={
                    "": token_uri
                }
            )
            
            self.data.next_token_id += 1
        
        @sp.entrypoint
        def transfer(self, params):
            """FA2 transfer entrypoint"""
            assert not self.data.paused, "TRANSFERS_PAUSED"
            
            for transfer in params:
                for tx in transfer.txs:
                    # Verify ownership or operator
                    assert (
                        transfer.from_ == sp.sender or
                        self.data.operators.contains((transfer.from_, sp.sender, tx.token_id))
                    ), FA2ErrorMessage.NOT_OWNER
                    
                    # Verify token exists
                    assert self.data.ledger.contains(tx.token_id), FA2ErrorMessage.TOKEN_UNDEFINED
                    
                    # Verify owner
                    assert self.data.ledger[tx.token_id] == transfer.from_, FA2ErrorMessage.INSUFFICIENT_BALANCE
                    
                    # Transfer (NFTs have amount = 1)
                    assert tx.amount == 1, "NFT_AMOUNT_MUST_BE_1"
                    self.data.ledger[tx.token_id] = tx.to_
        
        @sp.entrypoint
        def update_operators(self, params):
            """FA2 operator management"""
            for update in params:
                if update.variant == "add_operator":
                    assert update.value.owner == sp.sender, FA2ErrorMessage.NOT_OWNER
                    self.data.operators[(update.value.owner, update.value.operator, update.value.token_id)] = ()
                else:  # remove_operator
                    assert update.value.owner == sp.sender, FA2ErrorMessage.NOT_OWNER
                    del self.data.operators[(update.value.owner, update.value.operator, update.value.token_id)]
        
        @sp.entrypoint
        def balance_of(self, params):
            """FA2 balance query"""
            balances = []
            for request in params.requests:
                assert self.data.ledger.contains(request.token_id), FA2ErrorMessage.TOKEN_UNDEFINED
                
                balance = 1 if self.data.ledger[request.token_id] == request.owner else 0
                balances.append(sp.record(
                    request=request,
                    balance=balance
                ))
            
            sp.transfer(balances, sp.tez(0), sp.contract(
                sp.list[sp.record(
                    request=sp.record(owner=sp.address, token_id=sp.nat),
                    balance=sp.nat
                )],
                params.callback,
                entrypoint="callback"
            ).unwrap_some())
        
        @sp.entrypoint
        def set_pause(self, paused):
            """Admin: pause/unpause minting and transfers"""
            assert sp.sender == self.data.admin, "NOT_ADMIN"
            self.data.paused = paused
        
        @sp.entrypoint
        def set_max_supply(self, new_max):
            """Admin: adjust max supply (can only increase)"""
            assert sp.sender == self.data.admin, "NOT_ADMIN"
            assert new_max >= self.data.max_supply, "CANNOT_DECREASE_SUPPLY"
            self.data.max_supply = new_max
        
        @sp.entrypoint
        def withdraw(self):
            """Admin: withdraw contract balance"""
            assert sp.sender == self.data.admin, "NOT_ADMIN"
            sp.send(self.data.admin, sp.balance)
        
        @sp.entrypoint
        def set_admin(self, new_admin):
            """Admin: transfer admin rights"""
            assert sp.sender == self.data.admin, "NOT_ADMIN"
            self.data.admin = new_admin


# Testing
if "templates" not in __name__:
    @sp.add_test(name="VaporwaveNature")
    def test():
        scenario = sp.test_scenario()
        scenario.h1("Vaporwave Nature - Tezos NFT Minting")
        
        # Test accounts
        admin = sp.test_account("Admin")
        alice = sp.test_account("Alice")
        bob = sp.test_account("Bob")
        
        # Deploy contract
        metadata_base_uri = sp.utils.bytes_of_string("ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
        contract = main.VaporwaveNature(
            admin=admin.address,
            metadata_base_uri=metadata_base_uri
        )
        
        scenario += contract
        
        # Test: Alice mints
        scenario.h2("Alice mints token #0")
        contract.mint().run(sender=alice, amount=sp.tez(5))
        scenario.verify(contract.data.ledger[0] == alice.address)
        scenario.verify(contract.data.next_token_id == 1)
        
        # Test: Bob mints
        scenario.h2("Bob mints token #1")
        contract.mint().run(sender=bob, amount=sp.tez(5))
        scenario.verify(contract.data.ledger[1] == bob.address)
        
        # Test: Wrong payment amount fails
        scenario.h2("Wrong payment fails")
        contract.mint().run(sender=alice, amount=sp.tez(3), valid=False)
        
        # Test: Transfer
        scenario.h2("Alice transfers token #0 to Bob")
        contract.transfer([
            sp.record(
                from_=alice.address,
                txs=[sp.record(to_=bob.address, token_id=0, amount=1)]
            )
        ]).run(sender=alice)
        scenario.verify(contract.data.ledger[0] == bob.address)
        
        # Test: Pause
        scenario.h2("Admin pauses minting")
        contract.set_pause(True).run(sender=admin)
        contract.mint().run(sender=alice, amount=sp.tez(5), valid=False)
        
        # Test: Unpause
        contract.set_pause(False).run(sender=admin)
        contract.mint().run(sender=alice, amount=sp.tez(5))
        
        # Test: Withdraw
        scenario.h2("Admin withdraws funds")
        contract.withdraw().run(sender=admin)
