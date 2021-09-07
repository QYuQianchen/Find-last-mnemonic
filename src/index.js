"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
// Mnemonics english wordlist
var ENGLISH_WORD_LIST = ethers_1.wordlists.en;
var WORD_LIST_LAST_INDEX = 2047; //0...2047
var MISSING_BITS_SIZE = 127; // 7 bits, 2**7 = 128, value from 0 to 127
/**
 * BIT 39: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
 * example: https://medium.com/coinmonks/mnemonic-generation-bip39-simply-explained-e9ac18db9477
 * Word list: https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt
 */
var decInBitsWithPadding = function (dec, padding) { return dec.toString(2).padStart(padding, '0'); };
var wordInDecToBits = function (wordInDec) {
    return wordInDec.reduce(function (str, dec) { return str + decInBitsWithPadding(dec, 11); }, '');
};
var hexToBits = function (hex) {
    var uint8array = Uint8Array.from(Buffer.from(hex, 'hex'));
    return uint8array.reduce(function (str, byte) { return str + decInBitsWithPadding(byte, 8); }, '');
};
// converting 128 bits to hex value.
var bits128Tohex = function (bits128) {
    var _a;
    return (_a = bits128.match(/\d{8}/g)) === null || _a === void 0 ? void 0 : _a.reduce(function (str, bits8) { return str + parseInt(bits8, 2).toString(16).padStart(2, '0'); }, '');
};
var main = function (knownWords) {
    var known_bits;
    var known_11_words;
    if (knownWords.length === 0) {
        // randomly generate 11 words
        var known_11_words_index = Array(11).fill(0).map(function (a) { return Math.round(Math.random() * WORD_LIST_LAST_INDEX); });
        known_11_words = known_11_words_index.map(function (wordIndex) { return ENGLISH_WORD_LIST.getWord(wordIndex); });
        known_bits = wordInDecToBits(known_11_words_index);
        console.log("Randomly generate 11 words of index : " + JSON.stringify(known_11_words_index) + "\n        \nWritten in bits: " + known_11_words + "\n        \nWritten in bits: " + known_bits);
    }
    else {
        known_11_words = knownWords.split(' ');
        known_bits = wordInDecToBits(known_11_words.map(function (word) { return ENGLISH_WORD_LIST.getWordIndex(word); }));
    }
    // there is 7 bits missing
    for (var index = 0; index < MISSING_BITS_SIZE; index++) {
        var possibleBits = decInBitsWithPadding(index, 7);
        var entropy = bits128Tohex(known_bits.concat(possibleBits));
        var checksum = ethers_1.utils.sha256("0x" + entropy).slice(2, 3);
        var lastWordInBits = possibleBits.concat(decInBitsWithPadding(parseInt(checksum, 16), 4)); // concatenate checksum in bits
        var lastWordIndex = parseInt(lastWordInBits, 2);
        var lastWord = ENGLISH_WORD_LIST.getWord(lastWordIndex);
        console.log("Adding bits " + possibleBits + " of index " + index + " gives entropy " + entropy + " with checksum " + checksum + " => last word " + lastWord);
        var mnemonic = known_11_words.concat(lastWord);
        // console.log(mnemonic.map(word => ENGLISH_WORD_LIST.getWordIndex(word)));
        // try {
        //     utils.mnemonicToEntropy(mnemonic.toString(), ENGLISH_WORD_LIST)
        // } catch (error) {
        //     console.error(error)
        // }
        // console.log(`mnemonic ${mnemonic} ${utils.isValidMnemonic(mnemonic.toString(), ENGLISH_WORD_LIST)} ${ENGLISH_WORD_LIST.split(mnemonic.join(', ')).length}`)
        console.log("[MNEMONIC] " + mnemonic.join(' ') + ". \nTry it at https://www.myetherwallet.com/wallet/access/software?type=mnemonic \n");
    }
    // Entropy in hexdecimal format; The initial entropy must be in 128-256 bits. 
    // const entropyHex = '063679ca1b28b5cfda9c186b367e271e';
    // console.log("sha256 test", utils.sha256("0x"+entropyHex))
    // console.log("Initial entropy", entropyHex);
    // // check if the initial entropy is in 128-256 bits
    // console.log("Entropy in bits", hexToBits(entropyHex));
    // console.log("Converting back", bits128Tohex(hexToBits(entropyHex)));
    // console.assert(hexToBits(entropyHex).length >= 128 && hexToBits(entropyHex).length <= 256, "Initial entropy is not between 128 and 256 bits.")
    // console.log("", constants.EtherSymbol);
};
// Replace "" with eleven words if exist
// e.g. "brain shift ability husband into mixed detail dizzy eager seed mechanic"
main("");
