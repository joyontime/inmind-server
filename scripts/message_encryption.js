/**
 * For putting in messages for
 *
 */


// CONSTANTS
var keySize = 128;
var iterations = iterationCount = 100;

// PER GROUP
var iv = 'eeb36656f5306b8894c745dc0a2c48f4';
console.log("IV: " + iv);

// PER PLANT
var salt = 'e068c517eed0ee3f5fa8a1208bceae595073937f8cdc4f5d2ec7f3e190e9f406';
console.log("Salt: " + salt);

var passPhrase = 'cb6f5cff7f64c65edf072c0cca1b9f28';
console.log("Passphrase: " + passPhrase);

// PER MESSAGE
var plainText = "If you give a mouse a cookie...";

console.log("Start");
var AesUtil = require('../crypto/AesUtil').AesUtil;
var aesUtil = new AesUtil(keySize, iterationCount)

console.log("Encrypt");
var encrypt = aesUtil.encrypt(salt, iv, passPhrase, plainText);
console.log(encrypt);

console.log("Decrypt");
var decrypt = aesUtil.decrypt(salt, iv, passPhrase, encrypt);
console.log(decrypt);
