const canvas = document.getElementById('roda_cores');
const tamanho = 320;
canvas.width = tamanho;
canvas.height = tamanho;
const contexto = canvas.getContext('2d');
let circulo_selecionar_x = 160;
let circulo_selecionar_y = 160;
let escuridao_atual = 0;
let transparencia_atual = 1;
let r_atual, g_atual, b_atual;
//
function atualizar_componentes() {
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    contexto.save();
    // Roda de cores
    const area_cores = contexto.createConicGradient(0, canvas.width / 2, canvas.height / 2);
    area_cores.addColorStop(0, `rgba(255, 0, 0,${transparencia_atual})`);
    area_cores.addColorStop(1 / 6, `rgba(255, 255, 0,${transparencia_atual})`);
    area_cores.addColorStop(2 / 6, `rgba(0, 255, 0,${transparencia_atual})`);
    area_cores.addColorStop(3 / 6, `rgba(0, 255, 255,${transparencia_atual})`);
    area_cores.addColorStop(4 / 6, `rgba(0, 0, 255,${transparencia_atual})`);
    area_cores.addColorStop(5 / 6, `rgba(255, 0, 255,${transparencia_atual})`);
    area_cores.addColorStop(1, `rgba(255, 0, 0,${transparencia_atual})`);
    contexto.fillStyle = area_cores;
    contexto.fillRect(0, 0, canvas.width, canvas.height);
    // Gradiente branco
    contexto.beginPath();
    const circulo_branco = contexto.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    circulo_branco.addColorStop(0, `rgba(255, 255, 255, ${transparencia_atual})`);
    circulo_branco.addColorStop(1, `rgba(255, 255, 255, 0)`);
    contexto.fillStyle = circulo_branco;
    contexto.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
    contexto.fill();
    // Claridade
    contexto.beginPath();
    contexto.fillStyle = `rgba(0, 0, 0, ${escuridao_atual})`;
    contexto.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
    contexto.fill();
    // Seletor
    contexto.beginPath();
    contexto.strokeStyle = `rgba(255, 255, 255, 1)`;
    contexto.lineWidth = 1;
    contexto.arc(circulo_selecionar_x, circulo_selecionar_y, 3, 0, 2 * Math.PI);
    contexto.stroke();
    contexto.beginPath();
    contexto.strokeStyle = `rgba(0, 0, 0, 1)`;
    contexto.lineWidth = 1;
    contexto.arc(circulo_selecionar_x, circulo_selecionar_y, 4, 0, 2 * Math.PI);
    contexto.stroke();
    //
    contexto.restore();
}

function obter_cor_roda(x = circulo_selecionar_x, y = circulo_selecionar_y) {
    const pixelData = contexto.getImageData(x, y, 1, 1).data;
    atualizar_cor_atual(pixelData[0], pixelData[1], pixelData[2]);
}

function atualizar_cor_atual(r = r_atual, g = g_atual, b = b_atual, exeto = undefined) {
    r_atual = r
    g_atual = g
    b_atual = b
    let a = isNaN(Number(transparencia_atual)) ? 1 : Number(transparencia_atual).toFixed(2);
    document.getElementById('cor_atual').style.backgroundColor = `rgba(${r},${g},${b},${a})`;
    document.getElementById('transparencia').value = transparencia_atual;
    let claridade = (Math.max(0, Math.min(255, r)) + Math.max(0, Math.min(255, g)) + Math.max(0, Math.min(255, b))) / (3 * 255);
    document.getElementById('claridade').value = (claridade.toFixed(2));
    if (exeto !== 'rgb') {
        document.getElementById('cor_atual_rgba').value = `${r}, ${g}, ${b}, ${a}`;
    }
    if (exeto !== 'hex') {
        document.getElementById('cor_atual_hex').value = rgba_para_hex(r, g, b, a);
    }
    if (exeto !== 'hsl') {
        document.getElementById('cor_atual_hsl').value = rgb_para_hsl(r, g, b);
    }
    if (exeto !== 'hwb') {
        document.getElementById('cor_atual_hwb').value = rgb_para_hwb(r, g, b);
    }
}

function rgba_para_hex(r, g, b, a) {
    a = Math.round(a * 255).toString(16).padStart(2, '0');
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) + a;
};

function rgb_para_hsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let l = (max + min) / 2;
    let h, s;
    if (delta === 0) {
        h = 0;
        s = 0;
    } else {
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
                break;
            case g:
                h = ((b - r) / delta + 2) * 60;
                break;
            case b:
                h = ((r - g) / delta + 4) * 60;
                break;
        }
    }
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return `${Math.round(h)}, ${s}, ${l}`;
}

function rgb_para_hwb(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h;
    if (delta === 0) {
        h = 0;
    } else if (max === r) {
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
        h = ((b - r) / delta + 2) * 60;
    } else {
        h = ((r - g) / delta + 4) * 60;
    }
    const w = min * 100;
    const bl = (1 - max) * 100;
    return `${Math.round(h)}, ${Math.round(w)}, ${Math.round(bl)}`;
}

function definir_transparencia(transparencia_nova) {
    transparencia_atual = transparencia_nova;
    document.getElementById('transparencia').value = transparencia_atual;
}

document.getElementById('cor_aleatoria').addEventListener('click', function () {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    atualizar_cor_atual(r, g, b);
});

document.getElementById('cor_atual_hex').addEventListener('input', function () {
    const hex = this.value;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = parseInt(hex.slice(7, 9), 16) / 255;
    definir_transparencia(a);
    atualizar_cor_atual(r, g, b, 'hex');
});

document.getElementById('cor_atual_rgba').addEventListener('input', function () {
    const rgb = this.value;
    const lista_rgba = rgb.split(',').slice(0, 4).map(Number);
    if (lista_rgba.length < 3) { return; };
    const r = lista_rgba[0];
    const g = lista_rgba[1];
    const b = lista_rgba[2];
    transparencia_atual = Number(lista_rgba[3]) || 1;
    atualizar_cor_atual(r, g, b, 'rgb');
});

document.getElementById('cor_atual_hsl').addEventListener('input', function () {
    const hsl = this.value;
    const lista_hsl = hsl.split(',').slice(0, 3).map(Number);
    if (lista_hsl.length < 3) { return; };
    let h = parseInt(lista_hsl[0]);
    let s = parseInt(lista_hsl[1]);
    let l = parseInt(lista_hsl[2]);
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    atualizar_cor_atual(r, g, b, 'hsl');
});

document.getElementById('cor_atual_hwb').addEventListener('input', function () {
    const hwb = this.value;
    const lista_hwb = hwb.split(',').slice(0, 3).map(Number);
    if (lista_hwb.length < 3) { return; };
    let h = parseInt(lista_hwb[0]);
    let w = parseInt(lista_hwb[1]);
    let b = parseInt(lista_hwb[2]);
    w /= 100;
    b /= 100;
    const ratio = w + b;
    if (ratio > 1) {
        w /= ratio;
        b /= ratio;
    }
    const c = 1 - b;
    const x = (1 - w - b) * (1 - Math.abs((h / 60) % 2 - 1));
    let r = 0, g = 0, bValue = 0;
    if (h < 60) {
        r = c;
        g = x;
    } else if (h < 120) {
        r = x;
        g = c;
    } else if (h < 180) {
        g = c;
        bValue = x;
    } else if (h < 240) {
        g = x;
        bValue = c;
    } else if (h < 300) {
        r = x;
        bValue = c;
    } else {
        r = c;
        bValue = x;
    }
    r = Math.round((r + w) * 255);
    g = Math.round((g + w) * 255);
    bValue = Math.round((bValue + w) * 255);
    atualizar_cor_atual(r, g, bValue, 'hwb');
});

document.getElementById('cor_atual_rgba').addEventListener('input', function () {
    const rgb = this.value;
    const lista_rgba = rgb.split(',').slice(0, 4).map(Number);
    if (lista_rgba.length < 3) { return; };
    const r = lista_rgba[0];
    const g = lista_rgba[1];
    const b = lista_rgba[2];
    transparencia_atual = Number(lista_rgba[3]) || 1;
    atualizar_cor_atual(r, g, b, 'rgb');
});

document.getElementById('roda_cores').addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    circulo_selecionar_x = x;
    circulo_selecionar_y = y;
    obter_cor_roda(x, y);
    atualizar_componentes();
});

document.getElementById('transparencia').addEventListener('input', function () {
    definir_transparencia(this.value);
    if (escuridao_atual > transparencia_atual) {
        escuridao_atual = transparencia_atual;
    }
    atualizar_cor_atual();
    atualizar_componentes();
});

document.getElementById('claridade').addEventListener('input', function () {
    let brilho = 1 - this.value;
    if (brilho > transparencia_atual) {
        escuridao_atual = transparencia_atual
    } else {
        escuridao_atual = brilho;
    }
    atualizar_componentes();
    obter_cor_roda();
});

function enviar_para_area_transferencia(valor) {
    navigator.clipboard.writeText(valor);
}

document.getElementById('copiar_hex').addEventListener('click', function () {
    enviar_para_area_transferencia(document.getElementById('cor_atual_hex').value);
});

document.getElementById('copiar_rgba').addEventListener('click', function () {
    enviar_para_area_transferencia(document.getElementById('cor_atual_rgba').value);
});

document.getElementById('copiar_hsl').addEventListener('click', function () {
    enviar_para_area_transferencia(document.getElementById('cor_atual_hsl').value);
});

document.getElementById('copiar_hwb').addEventListener('click', function () {
    enviar_para_area_transferencia(document.getElementById('cor_atual_hwb').value);
});

atualizar_cor_atual(255, 255, 255);
atualizar_componentes();

document.getElementById('fixar_cor').addEventListener('click', function () {
    const cor_atual = window.getComputedStyle(document.getElementById('cor_atual')).backgroundColor;
    const rgb = document.getElementById('cor_atual_rgba').value;
    //
    const cor_fixada = document.createElement('button');
    cor_fixada.style.backgroundColor = cor_atual
    cor_fixada.classList.add('cor_fixada');
    //
    cor_fixada.addEventListener('click', function () {
        const lista_rgba = rgb.split(',').slice(0, 4).map(Number);
        const r = lista_rgba[0];
        const g = lista_rgba[1];
        const b = lista_rgba[2];
        transparencia_atual = lista_rgba[3];
        // claridade
        atualizar_cor_atual(r, g, b);
    });
    //
    document.getElementById('cores_fixadas').appendChild(cor_fixada);
});


