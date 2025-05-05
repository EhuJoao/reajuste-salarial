import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const { idadeFuncionario, genero, salarioBase, anoEntrada, codigoFuncionario } = req.query;

  if (!idadeFuncionario || !genero || !salarioBase || !anoEntrada || !codigoFuncionario) {
    return res.send("⚠️ Por favor, preencha todos os campos: idadeFuncionario, genero, salarioBase, anoEntrada e codigoFuncionario.");
  }

  const idade = parseInt(idadeFuncionario);
  const salario = parseFloat(salarioBase);
  const anoContratacao = parseInt(anoEntrada);
  const anoAtual = new Date().getFullYear();
  const tempoDeCasa = anoAtual - anoContratacao;

  if (idade < 18 || idade > 99) {
    return res.send("❌ Idade inválida (deve estar entre 18 e 99 anos).");
  }

  if (salario <= 0) {
    return res.send("❌ Salário base inválido (deve ser maior que zero).");
  }

  if (anoContratacao > anoAtual) {
    return res.send("❌ Ano de entrada não pode ser no futuro.");
  }

  if (genero !== 'M' && genero !== 'F') {
    return res.send("❌ Gênero inválido (use 'M' para masculino ou 'F' para feminino).");
  }

  let percentualReajuste = 0;
  let valorAdicional = 0;

  if (idade >= 18 && idade <= 39) {
    percentualReajuste = genero === 'M' ? 0.10 : 0.08;
    valorAdicional = tempoDeCasa <= 10 ? (genero === 'M' ? 10 : 11) : (genero === 'M' ? 17 : 16);
  } else if (idade >= 40 && idade <= 69) {
    percentualReajuste = genero === 'M' ? 0.08 : 0.10;
    valorAdicional = tempoDeCasa <= 10 ? (genero === 'M' ? 5 : 7) : (genero === 'M' ? 15 : 14);
  } else if (idade >= 70) {
    percentualReajuste = genero === 'M' ? 0.15 : 0.17;
    valorAdicional = tempoDeCasa <= 10 ? (genero === 'M' ? 15 : 17) : (genero === 'M' ? 13 : 12);
  }

  const novoSalario = salario + (salario * percentualReajuste) + valorAdicional;

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resumo Salarial</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: #0f0f0f;
          font-family: 'Courier New', monospace;
          color: #e0e0e0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .painel {
          background: #1a1a1a;
          border: 2px solid #ffffff;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 0 25px #ffffff;
          width: 90%;
          max-width: 600px;
        }

        .painel h1 {
          color: #ffffff;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .linha {
          margin: 12px 0;
          font-size: 1rem;
        }

        .chave {
          color: #aaaaaa;
        }

        .valor {
          color: #ffffff;
          font-weight: bold;
        }

        .final {
          margin-top: 2rem;
          font-size: 1.3rem;
          color:  #ffffff;
          text-align: center;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="painel">
        <h1>💼 Reajuste Salarial</h1>
        <div class="linha"><span class="chave">Código:</span> <span class="valor">${codigoFuncionario}</span></div>
        <div class="linha"><span class="chave">Idade:</span> <span class="valor">${idade} anos</span></div>
        <div class="linha"><span class="chave">Gênero:</span> <span class="valor">${genero}</span></div>
        <div class="linha"><span class="chave">Salário Base:</span> <span class="valor">R$ ${salario.toFixed(2)}</span></div>
        <div class="linha"><span class="chave">Ano de Entrada:</span> <span class="valor">${anoContratacao}</span></div>
        <div class="linha"><span class="chave">Tempo na Empresa:</span> <span class="valor">${tempoDeCasa} anos</span></div>
        <div class="linha"><span class="chave">Reajuste (%):</span> <span class="valor">${(percentualReajuste * 100).toFixed(1)}%</span></div>
        <div class="linha"><span class="chave">Adicional:</span> <span class="valor">R$ ${valorAdicional}</span></div>
        <div class="final">Novo Salário: R$ ${novoSalario.toFixed(2)}</div>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Servidor online em: http://localhost:${port}`);
});
export default app;

// http://localhost:3000/?idadeFuncionario=30&genero=M&salarioBase=2000&anoEntrada=2021&codigoFuncionario=123