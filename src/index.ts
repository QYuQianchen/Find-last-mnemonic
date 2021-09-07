import {utils, wordlists} from "ethers";

// Mnemonics english wordlist
const ENGLISH_WORD_LIST = wordlists.en;
const WORD_LIST_LAST_INDEX = 2047; //0...2047
const MISSING_BITS_SIZE = 128; // 7 bits, 2**7 = 128, value from 0 to 127

/**
 * BIT 39: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
 * example: https://medium.com/coinmonks/mnemonic-generation-bip39-simply-explained-e9ac18db9477
 * Word list: https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt
 */

const decInBitsWithPadding = (dec: number, padding: number) => dec.toString(2).padStart(padding, '0');

const wordInDecToBits = (wordInDec: number[]) => {
    return wordInDec.reduce((str, dec) => str + decInBitsWithPadding(dec, 11), '');
}

const hexToBits = (hex: string) => {
    const uint8array = Uint8Array.from(Buffer.from(hex,'hex'));
    return uint8array.reduce((str, byte) => str + decInBitsWithPadding(byte, 8), '');
}
// converting 128 bits to hex value.
const bits128Tohex = (bits128: string) => {
    return bits128.match(/\d{8}/g)?.reduce((str, bits8) => str + parseInt(bits8, 2).toString(16).padStart(2, '0'), '');
}

const main = (knownWords: string) => {
    let known_bits;
    let known_11_words;
    if (knownWords.length === 0) {
        // randomly generate 11 words
        const known_11_words_index = Array(11).fill(0).map(a => Math.round(Math.random()*WORD_LIST_LAST_INDEX));
        known_11_words = known_11_words_index.map(wordIndex => ENGLISH_WORD_LIST.getWord(wordIndex));
        known_bits = wordInDecToBits(known_11_words_index);
        console.log(`Randomly generate 11 words of index : ${JSON.stringify(known_11_words_index)}
        \n      Written in English: ${known_11_words}
        \n      Written in bits: ${known_bits}\n`);
    } else {
        known_11_words = knownWords.split(' ');
        known_bits = wordInDecToBits(known_11_words.map(word => ENGLISH_WORD_LIST.getWordIndex(word)));
        console.log(`Provided 11 words:
        \n      Written in English: ${known_11_words}
        \n      Written in bits: ${known_bits}\n`);
    }
    
    let possibleLastwords = [];
    let possibleMnemonics = [];
    // there is 7 bits missing
    for (let index = 0; index < MISSING_BITS_SIZE; index++) {
        const possibleBits = decInBitsWithPadding(index, 7);
        const entropy = bits128Tohex(known_bits.concat(possibleBits));
        const checksum = utils.sha256("0x" + entropy).slice(2,3);
        const lastWordInBits = possibleBits.concat(decInBitsWithPadding(parseInt(checksum, 16), 4)); // concatenate checksum in bits
        const lastWordIndex = parseInt(lastWordInBits, 2);
        const lastWord = ENGLISH_WORD_LIST.getWord(lastWordIndex);
        // console.log(`Adding bits ${possibleBits} of index ${index} gives entropy ${entropy} with checksum ${checksum} => last word ${lastWord}`)
        const mnemonic = known_11_words.concat(lastWord).join(' ');
        // console.log(`[MNEMONIC] ${mnemonic.join(' ')}. \nTry it at https://www.myetherwallet.com/wallet/access/software?type=mnemonic \n`)

        possibleLastwords.push(lastWord);
        possibleMnemonics.push(mnemonic);
    }
    
    console.log(`You may pic one word from the list:\n${possibleLastwords.join(' ')}\n`)
    console.log(`A full list of possible mnemonic phrases:\n`)
    console.table(possibleMnemonics);
    console.log(`Try it at https://www.myetherwallet.com/wallet/access/software?type=mnemonic`)

}

// Replace "" with eleven words if exist
// e.g. "brain shift ability husband into mixed detail dizzy eager seed mechanic"
main("");