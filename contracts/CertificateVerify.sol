// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title CertificateVerification
 * @dev Store and retrieve Certificates
 */
contract CertificateVerification {
    struct Certificate {
        address issuer;
        string recipientName;
        string recipientAadhaar;
        string imgHash;
        uint256 issueDate;
        uint256 creationDate; 
    }
    mapping(string => Certificate) internal certificates;
    address payable public owner;
    mapping(address => bool) public whitelist;

    event IssuedCertificate(address indexed issuer, uint256 _issueDate);

    /**
     * @notice Add owner wallet to whitelist
     */
    constructor() {
        whitelist[msg.sender] = true;
        owner = payable(msg.sender);
    }

    /**
     * @notice Add wallet to whitelist
     */
    function addWhitelistWallet(address payable _wallet) public {
        require(msg.sender == owner, "ONLY_OWNER_CAN_ADD");
        whitelist[_wallet] = true;
    }

     /**
     * @notice Remove wallet from whitelist
     */
    function removeWhitelistWallet(address payable _wallet) public {
        delete whitelist[_wallet];
    }

    /**
     * @notice Whitelisted wallets can issue certificate
     */
    function issueCertificate(string memory _id, string memory _recipientName, string memory _recipientAadhaar, string memory _imgHash, uint256 _issueDate) public  {
        require(whitelist[msg.sender], "NOT_IN_WHITELIST");
        require(certificates[_id].creationDate == 0, "ALREADY_EXISTS");
        Certificate memory newCertificate = Certificate({
            issuer: msg.sender,
            recipientName: _recipientName,
            recipientAadhaar: _recipientAadhaar,
            imgHash: _imgHash,
            issueDate: _issueDate,
            creationDate: block.timestamp
        });
        certificates[_id] = newCertificate;
        emit IssuedCertificate(msg.sender, block.timestamp);
    }

    /**
     * @notice Retrieve certificate from blockchain
     */
    function getCertificate(string memory _id) public view returns (Certificate memory) {
        require(certificates[_id].creationDate != 0, "CANNOT_FIND");
        return certificates[_id];
    }
}