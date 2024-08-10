const { expect } = require("chai");
const { ethers } = require("hardhat"); 

const tokens = (n) => {
    return ethers.utils.parseUnits(n, "ether");
}

describe("Token", function () {
    let token;
    let accounts;
    let deployer;

    this.beforeEach(async function () {
        //Fetch Token from Blockchain
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy('Barcelona Beach', 'BCB', '1000000');
       
        accounts = await ethers.getSigners();
        deployer = accounts[0];
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
 
})