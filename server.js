const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Venda = require('./app/models/vendas');
const Pedido = require('./app/models/pedidos');
const cors = require('cors')


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/copiadora',{useNewUrlParser: true},);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

const port = process.env.port || 3030;


//Criando uma instância das Rotas via Express:
const router = express.Router();

router.use((req, res, next) => {    next();  /*Midlaware*/});


router.get('/', (req, res) => {
    res.json({ message: 'Rota Teste' })
});

    /* 1) Método: Criar Produto (acessar em: POST http://localhost:8000/api/produtos)  */
router.route('/vendas').post((req, res) =>{
        const venda = new Venda();
        
        venda.objetos = req.body.objetos
        venda.obs = req.body.obs

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
        Venda.findById(req.params.produto_id, function(error, venda) {
            
            if (error) 
                res.send("Id do Produto não encontrado....: " + error);

                //Segundo: 
                venda.objetos = req.body.objetos
                venda.obs = req.body.obs
            
                //Terceiro: Agora que já atualizamos os dados, vamos salvar as propriedades:
                venda.save(function(error) {
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
// Api Pedidos
router.route('/pedidos').post(function(req, res) {
    const pedido = new Pedido();
 
    
    pedido.objetos = req.body.objetos
    pedido.obs = req.body.obs

    pedido.save(function(error) {
        if(error)
            res.send('Erro ao tentar salvar o Produto....: ' + error);
        res.header("Access-Control-Allow-Origin", "*")
        res.json({ message: 'Pedido Cadastrado com Sucesso!' });
    });
})

/* 2) Método: Selecionar Todos Produtos (acessar em: GET http://localhost:8000/api/produtos)  */
.get(function(req, res) {
    Pedido.find(function(error, pedido) {
        if(error) 
            res.send('Erro ao tentar Selecionar Todos os produtos...: ' + error);

        res.json(pedido);
    });
});
router.route('/pedidos/:produto_id')

    /* 3) Método: Selecionar por Id: (acessar em: GET http://localhost:8000/api/produtos/:produto_id) */
    .get(function (req, res) {
        
        //Função para poder Selecionar um determinado produto por ID - irá verificar se caso não encontrar um detemrinado
        //produto pelo id... retorna uma mensagem de error:
        Pedido.findById(req.params.produto_id, function(error, produto) {
            if(error)
                res.send('Id do Produto não encontrado....: ' + error);

            res.json(produto);
        });
    })






//Definindo um padrão das rotas prefixadas: '/api':
app.use('/api', router);

//Iniciando a Aplicação (servidor):
app.listen(port);
console.log("Iniciando a app na porta " + port);