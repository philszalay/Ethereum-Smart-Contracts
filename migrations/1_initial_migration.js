const Contract = artifacts.require("./DappsUniverseFixedSupply.sol");

module.exports = function (deployer) {
  deployer.deploy(Contract);
};
