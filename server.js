const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Venda = require('./app/models/vendas');
const cors = require('cors')


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/copiadora',{useNewUrlParser: true},);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

const port = process.env.port || 3030;


//Rotas da nossa API:

//Criando uma instância das Rotas via Express:
const router = express.Router();

//Middleware para usar em todos os requests enviados para a nossa API- Mensagem Padrão:
router.use(function(req, res, next) {
    console.log('Algo está acontecendo aqui....');
    next(); //aqui é para sinalizar de que prosseguiremos para a próxima rota. E que não irá parar por aqui!!!
});

//Rota de Teste para sabermos se tudo está realmente funcionando (acessar através: GET: http://localhost:8000/api): 
router.get('/', function(req, res) {
    res.json({ message: 'Beleza! Bem vindo(a) a nossa Loja XYZ' })
});

//API's:
//==============================================================================

//Rotas que terminarem com '/produtos' (servir: GET ALL & POST)
    /* 1) Método: Criar Produto (acessar em: POST http://localhost:8000/api/produtos)  */
router.route('/vendas').post(function(req, res) {
        const venda = new Venda();
        console.log(req.body)
        //Aqui vamos setar os campos do produto (via request):
        venda.objetos = req.body.objetos;
   
        venda.save(function(error) {
            if(error)
                res.send('Erro ao tentar salvar o Produto....: ' + error);
            res.header("Access-Control-Allow-Origin", "*")
            res.json({ message: 'Venda Cadastrado com Sucesso!' });
        });
    })

    /* 2) Método: Selecionar Todos Produtos (acessar em: GET http://localhost:8000/api/produtos)  */
    .get(function(req, res) {
        Venda.find(function(error, vendas) {
            if(error) 
                res.send('Erro ao tentar Selecionar Todos os produtos...: ' + error);

            res.json(vendas);
        });
    });

    //Rotas que irão terminar em '/produtos/:produto_id' (servir tanto para: GET, PUT & DELETE: id):
    router.route('/vendas/:produto_id')

    /* 3) Método: Selecionar por Id: (acessar em: GET http://localhost:8000/api/produtos/:produto_id) */
    .get(function (req, res) {
        
        //Função para poder Selecionar um determinado produto por ID - irá verificar se caso não encontrar um detemrinado
        //produto pelo id... retorna uma mensagem de error:
        Venda.findById(req.params.produto_id, function(error, produto) {
            if(error)
                res.send('Id do Produto não encontrado....: ' + error);

            res.json(produto);
        });
    })

    /* 4) Método: Atualizar por Id: (acessar em: PUT http://localhost:8000/api/produtos/:produto_id) */
    .put(function(req, res) {

        //Primeiro: para atualizarmos, precisamos primeiro achar 'Id' do 'Produto':
        Venda.findById(req.params.produto_id, function(error, produto) {
            if (error) 
                res.send("Id do Produto não encontrado....: " + error);

                //Segundo: 
                produto.nome = req.body.nome;
                produto.preco = req.body.preco;
                produto.descricao = req.body.descricao;

                //Terceiro: Agora que já atualizamos os dados, vamos salvar as propriedades:
                produto.save(function(error) {
                    if(error)
                        res.send('Erro ao atualizar o produto....: ' + error);

                    res.json({ message: 'Produto atualizado com sucesso!' });
                });
            });
        })

        /* 5) Método: Excluir por Id (acessar: http://localhost:8000/api/produtos/:produto_id) */
        .delete(function(req, res) {
            
            Venda.remove({
                _id: req.params.produto_id
                }, function(error) {
                    if (error) 
                        res.send("Id do Produto não encontrado....: " + error);

                    res.json({ message: 'Produto Excluído com Sucesso!' });
                });
            });


//Definindo um padrão das rotas prefixadas: '/api':
app.use('/api', router);

//Iniciando a Aplicação (servidor):
app.listen(port);
console.log("Iniciando a app na porta " + port);