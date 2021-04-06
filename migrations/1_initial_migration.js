const Contract = artifacts.require("./DappsUniverseTokenFactory.sol");

module.exports = function (deployer) {
  deployer.deploy(Contract);
};
