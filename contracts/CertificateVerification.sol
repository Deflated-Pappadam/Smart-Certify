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

    constructor() {
        owner = payable(msg.sender);
    }

    function issueCertificate(string memory _id, string memory _recipientName, string memory _recipientAadhaar, string memory _imgHash, uint256 _issueDate) public  {
        require(msg.sender == owner, "Only the contract owner can issue certificates!");
        Certificate memory newCertificate = Certificate({
            issuer: msg.sender,
            recipientName: _recipientName,
            recipientAadhaar: _recipientAadhaar,
            imgHash: _imgHash,
            issueDate: _issueDate,
            creationDate: block.timestamp
        });
        require(certificates[_id].creationDate == 0, "certificate with that id already exists!");
        certificates[_id] = newCertificate;
    }

    function getCertificate(string memory _id) public view returns (Certificate memory) {
        require(certificates[_id].creationDate != 0, "cannot find certificate with that id!");
        return certificates[_id];
    }
}