const { expect } = require("chai");
const { ethers } = require("hardhat"); 

const tokens = (n) => {
    return ethers.utils.parseUnits(n, "ether");
}

describe("Token", function () {
    let token, accounts, deployer, receiver, exchange;

    this.beforeEach(async function () {
        //Fetch Token from Blockchain
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy(
            'Barcelona Beach', 'BCB', '1000000'
        );
       
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        receiver = accounts[1];
        exchange = accounts[2];
    });

    describe("Deployment", function () {
        const name = "Barcelona Beach";
        const symbol = "BCB";
        const decimals = "18";
        const totalSupply = tokens("1000000");

        it("has correct name", async function () {
            expect(await token.name()).to.equal(name);
          });
        
          it("has correct symbol", async function () {
            expect(await token.symbol()).to.equal(symbol);
          });
        
          it("has correct decimals", async function () {
            expect(await token.decimals()).to.equal(decimals);
          });
        
          it("has correct total supply", async function () {
            expect(await token.totalSupply()).to.equal(totalSupply);
          });

          it("assigns correct total supply to deployer", async function () {
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
          });
    })

    describe("Sending Token", function () {
        let amount,transaction,result;

        beforeEach(async function () {
            amount = tokens('100');
            transaction = await token.connect(deployer).transfer(receiver.address, amount);
            result = await transaction.wait();
        })

        describe("Success", function () {
            it("Transfers token balance", async function () {
                console.log("deployer balance before transfer", await token.balanceOf(deployer.address));
                console.log("receiver balance before transfer", await token.balanceOf(receiver.address));
            });
    
            it("Emits Transfer event", async function () {
                const event = result.events[0];
                expect(event.event).to.equal("Transfer");
    
                const args = event.args;
                expect(args.from).to.equal(deployer.address);
                expect(args.to).to.equal(receiver.address);
                expect(args.value).to.equal(amount);
            });
    
        })
        
    describe('Failure', function () {
        it('rejects insufficient balance', async function () {
            const invalidAmount = tokens('10000000');
            await expect(token.connect(receiver).transfer(deployer.address, invalidAmount)).to.be.revertedWith('Not enough tokens');
        });

        it('rejects invalid recipient', async function () {
            const amount = tokens('100');
            await expect(token.connect(deployer).transfer(ethers.constants.AddressZero, amount)).to.be.revertedWith('Invalid recipient');
        });
    })
    })

    describe('Approving Token', function () {
        let amount,transaction,result;

        beforeEach(async function () {
            amount = tokens('100');
            transaction = await token.connect(deployer).approve(exchange.address, amount);
            result = await transaction.wait();
        })

        describe("Success", function () {
            it("Allocates an allowance for delegated token spending", async function () {
                console.log(await token.allowance(deployer.address, exchange.address));
            });
    
            it("Emits Approval event", async function () {
                const event = result.events[0];
                expect(event.event).to.equal("Approval");
    
                const args = event.args;
                expect(args.owner).to.equal(deployer.address);
                expect(args.spender).to.equal(exchange.address);
                expect(args.value).to.equal(amount);
            });
    
        })

        describe('Failure', function () {
            it("rejects invalid spender", async function () {
                await expect(
                    token.connect(deployer).approve(ethers.constants.AddressZero, amount)
                ).to.be.revertedWith("Invalid spender");
            });
        })
    })
})