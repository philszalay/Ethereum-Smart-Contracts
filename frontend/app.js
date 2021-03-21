window.web3 = new Web3(window.web3? window.web3.currentProvider : new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/0ea14456f513454ea520fd84dc9083a9'));

// Contract address on the ropsten network.
const contractAddress = '0xeabaCFee0792452bF681e3d263222FacF0fa289B';

// ABI is a 'contract description' file that web3 uses to create a instance of the contract. 
const ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_content",
				"type": "bytes32"
			}
		],
		"name": "addTodo",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lastIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "markTodoAsDone",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "maxAmountOfTodosForUser",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "todos",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "content",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "creationDate",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isDone",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

let contractInstance = new web3.eth.Contract(ABI, contractAddress);

contractInstance.methods.addTodo(web3.utils.fromAscii('Wash the dishes')).send({
	// Address I'm using with MetaMask.
	from: '0x92CC29571BCB4E345575Ff1dcCB63A27588D319e'
}).then(res => {
  console.log(res);
});
