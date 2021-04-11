const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Venda = require('./app/models/vendas');
const Pedido = require('./app/models/pedidos');
const cors = require('cors')


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/copiadora', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

const port = process.env.port || 3030;

const router = express.Router();

router.use((req, res, next) => { next();  /*Midlaware*/ });


router.get('/', (req, res) => {
    res.json({ message: 'Rota Teste' })
});


router.route('/vendas').post((req, res) => {
    const venda = new Venda()

    venda.objetos = req.body.objetos
    venda.obs = req.body.obs
    venda.funcionario = req.body.funcionario
    venda.save((error) => {
        if (error)
            res.send('Erro ao tentar salvar o Produto....: ' + error)
        res.header("Access-Control-Allow-Origin", "*")
        res.json({ message: 'Venda Cadastrado com Sucesso!' })
    })
}).get((req, res) => {
    Venda.find((error, vendas) => {
        if (error)
            res.send('Erro ao tentar Selecionar Todos os produtos...: ' + error)

        res.json(vendas)

    })

})

router.route('/vendas/:produto_id').get((req, res) =>{
        Venda.findById(req.params.produto_id, (error, produto) =>{
            if (error)
                res.send('Id do Produto não encontrado....: ' + error);

            res.json(produto);
        });
    }).put((req, res) =>{
        Venda.findById(req.params.produto_id, (error, venda) =>{

            if (error)
                res.send("Id do Produto não encontrado....: " + error);

            //Segundo: 
            venda.objetos = req.body.objetos
            venda.obs = req.body.obs

            //Terceiro: Agora que já atualizamos os dados, vamos salvar as propriedades:
            venda.save(function (error) {
                if (error)
                    res.send('Erro ao atualizar o produto....: ' + error);

                res.json({ message: 'Produto atualizado com sucesso!' });
            });
        });
    }).delete((req, res) =>{

        Venda.deleteOne({
            _id: req.params.produto_id
        }, (error) =>{
            if (error)
                res.send("Id do Produto não encontrado....: " + error)

            res.json({ message: 'Produto Excluído com Sucesso!' })})
    })

// Api Pedidos
router.route('/pedidos').post((req, res) => {
    const pedido = new Pedido()

    pedido.objetos = req.body.objetos
    pedido.obs = req.body.obs
    pedido.funcionario = req.body.funcionario

    pedido.save((error) => {
        if (error)
            res.send('Erro ao tentar salvar o Produto....: ' + error)
        res.header("Access-Control-Allow-Origin", "*")
        res.json({ message: 'Pedido Cadastrado com Sucesso!' })
    })
}).get((req, res) =>{
        Pedido.find((error, pedido) =>{
            if (error)
                res.send('Erro ao tentar Selecionar Todos os produtos...: ' + error)

            res.json(pedido)
        })})
router.route('/pedidos/:produto_id').get((req, res) =>{
        Pedido.findById(req.params.produto_id, (error, produto) => {
            if (error)
                res.send('Id do Produto não encontrado....: ' + error)

            res.json(produto);
        })
    }).put((req, res) =>{

        //Primeiro: para atualizarmos, precisamos primeiro achar 'Id' do 'Produto':
        Pedido.findById(req.params.produto_id, (error, pedido)=> {

            if (error)
                res.send("Id do Produto não encontrado....: " + error);

            //Segundo: 
            pedido.objetos = req.body.objetos
            pedido.obs = req.body.obs

            //Terceiro: Agora que já atualizamos os dados, vamos salvar as propriedades:
            pedido.save((error) =>{
                if (error) 
                    res.send('Erro ao atualizar o produto....: ' + error);

                res.json({ message: 'Produto atualizado com sucesso!' });
            });
        });
    }).delete((req, res) =>{

        Pedido.deleteOne({
            _id: req.params.produto_id
        }, (error) =>{
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