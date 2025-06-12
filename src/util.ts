// ripped and converted to TS from https://www.webtoolkit.info/javascript-sha256.html.
// no changes to logic
export const stringToSha256 = (s: string): string => {
  const chrsz = 8;
  const hexcase = 0;

  function safe_add(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >>> 16) + (y >>> 16) + (lsw >>> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function S(X: number, n: number): number {
    return (X >>> n) | (X << (32 - n));
  }

  function R(X: number, n: number): number {
    return X >>> n;
  }

  function Ch(x: number, y: number, z: number): number {
    return (x & y) ^ (~x & z);
  }

  function Maj(x: number, y: number, z: number): number {
    return (x & y) ^ (x & z) ^ (y & z);
  }

  function Sigma0256(x: number): number {
    return S(x, 2) ^ S(x, 13) ^ S(x, 22);
  }

  function Sigma1256(x: number): number {
    return S(x, 6) ^ S(x, 11) ^ S(x, 25);
  }

  function Gamma0256(x: number): number {
    return S(x, 7) ^ S(x, 18) ^ R(x, 3);
  }

  function Gamma1256(x: number): number {
    return S(x, 17) ^ S(x, 19) ^ R(x, 10);
  }

  function core_sha256(m: number[], l: number): number[] {
    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
      0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
      0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
      0xfc19dc6,  0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
      0x6ca6351,  0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
      0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
      0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
      0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
      0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    let HASH = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    const W = new Array<number>(64);

    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;

    for (let i = 0; i < m.length; i += 16) {
      let [a, b, c, d, e, f, g, h] = HASH;

      for (let j = 0; j < 64; j++) {
        if (j < 16) {
          W[j] = m[j + i];
        } else {
          W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
        }

        const T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
        const T2 = safe_add(Sigma0256(a), Maj(a, b, c));

        [h, g, f, e, d, c, b, a] = [
          g,
          f,
          e,
          safe_add(d, T1),
          c,
          b,
          a,
          safe_add(T1, T2)
        ];
      }

      HASH = [
        safe_add(HASH[0], a),
        safe_add(HASH[1], b),
        safe_add(HASH[2], c),
        safe_add(HASH[3], d),
        safe_add(HASH[4], e),
        safe_add(HASH[5], f),
        safe_add(HASH[6], g),
        safe_add(HASH[7], h)
      ];
    }

    return HASH;
  }

  function str2binb(str: string): number[] {
    const bin: number[] = [];
    const mask = (1 << chrsz) - 1;
    for (let i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    }
    return bin;
  }

  function Utf8Encode(str: string): string {
    str = str.replace(/\r\n/g, "\n");
    let utftext = "";

    for (let n = 0; n < str.length; n++) {
      const c = str.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }

  function binb2hex(binarray: number[]): string {
    const hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    let str = "";

    for (let i = 0; i < binarray.length * 4; i++) {
      const byte = (binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xff;
      str += hex_tab.charAt((byte >> 4) & 0x0f) + hex_tab.charAt(byte & 0x0f);
    }

    return str;
  }

  s = Utf8Encode(s);
  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
};


export const keyifyString = (s: string) => (
  s.trim() // remove starting/trailing whitespaces
  .toLowerCase()
  .replace(/[^\w\s]/g, '') // replace non word characters except whitespace
  .substring(0, 48) // grab first 48 characters
  .trim() // remove trailing whitespaces
  .replace(/\s/g, '_') // replace whitespace with _
)

export const createHashWithContextString = (ctx: string, s: string) => {
  return stringToSha256(ctx+s)
}

export const createKeyWithContextString = (ctx: string, s: string) => {
  ctx = keyifyString(ctx);
  s = keyifyString(s);

  return `${ctx}.${s}`;
}

export const createKeyFromString = (s: string) => keyifyString(s)
export const createHashFromString = (s: string) => stringToSha256(s)
