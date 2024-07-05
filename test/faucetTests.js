const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();

    const [owner] = await ethers.getSigners();
    let withdrawAmount = ethers.parseUnits("1", "ether");
    
    return { faucet, owner, withdrawAmount };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });
  it('should not allow withdrawals above .1 ETH at a time', async function () {
    const { faucet, withdrawAmount } = await loadFixture(
      deployContractAndSetVariables
    );
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });
  it('should destroy the contract only when the owner calls', async function () {
    let { faucet, owner } = await loadFixture(deployContractAndSetVariables);
    
    expect(await faucet.destroyFaucet()).to.be.reverted;
    faucent = faucet.connect('non-owner');
    expect(await faucet.destroyFaucet()).to.not.be.reverted;
  });
  it('should withdraw ETH only when the owner calls', async function () {
    let { faucet, owner } = await loadFixture(deployContractAndSetVariables);
    expect(await faucet.withdrawAll()).to.be.reverted;
    faucent = faucet.connect('non-owner');
    expect(await faucet.withdrawAll()).to.not.be.reverted;
  })
});