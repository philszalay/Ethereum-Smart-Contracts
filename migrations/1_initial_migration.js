const MathExamples = artifacts.require("./MathExamples.sol");

module.exports = function (deployer) {
  deployer.deploy(MathExamples);
};
