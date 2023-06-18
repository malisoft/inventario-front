function verhoeff(num, times) {
    var d = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
        [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
        [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
        [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
        [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
        [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
        [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
        [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ]
    var p = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ]
    var inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]
    for (; times > 0; times--) {
        var c = 0
        for (var i = num.length - 1; i >= 0; i--) {
            c = d[c][p[((num.length - i) % 8)][num[i]]]
        }
        num += inv[c]
    }
    return num
}

function arc4(msg, key) {
    var state = []
    for (var i = 0; i < 256; i++) {
        state[i] = i
    }
    var j = 0
    for (var i = 0; i < 256; i++) {
        j = (j + state[i] + key[i % key.length].charCodeAt(0)) % 256
        temp = state[i]
        state[i] = state[j]
        state[j] = temp
    }
    x = 0, y = 0
    var output = ""
    var temp
    var x
    var y
    for (var i = 0; i < msg.length; i++) {
        x = (x + 1) % 256
        y = (state[x] + y) % 256
        temp = state[x]
        state[x] = state[y]
        state[y] = temp
        output += ("0" + (msg[i].charCodeAt(0) ^ state[(state[x] + state[y]) % 256]).toString(16)).slice(-2)
    }
    return output.toUpperCase();
}

function base64(number) {
    var result = ""
    var dic = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/"
    while (number > 0) {
        result = dic[number % 64] + result
        number = Math.floor(number / 64)
    }
    return result
}
export const controlCode = (auth, number, nit, date, total, key) => {
    var code = "";
    var number = verhoeff(number, 2)
    var nit = verhoeff(nit, 2)
    var date = verhoeff(date, 2)
    var total = verhoeff(total.toString(), 2)
    var vf = verhoeff("" + (
        parseInt(number) +
        parseInt(nit) +
        parseInt(date) +
        parseInt(total)), 5).slice(-5)

    var input = [auth, number, nit, date, total]
    var idx = 0;
    for (var i = 0; i < 5; i++) {
        code += input[i] + key.substring(idx, idx + 1 + parseInt(vf[i]))
        idx += 1 + parseInt(vf[i])
    }
    code = arc4(code, key + vf)

    var final_sum = 0
    var total_sum = 0
    var partial_sum = [0, 0, 0, 0, 0]
    for (var i = 0; i < code.length; i++) {
        partial_sum[i % 5] += code[i].charCodeAt(0)
        total_sum += code[i].charCodeAt(0)
    }
    for (var i = 0; i < 5; i++) {
        final_sum += Math.floor((total_sum * partial_sum[i]) / (1 + parseInt(vf[i])))
    }
    code = arc4(base64(final_sum), key + vf).match(/.{2}/g).join("-")
    return code
}