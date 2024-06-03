const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const corsOptions = {
    origin: '*', 
    credentials: true, 
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabaseUrl = 'https://ivmaalkhcfrpkkkjwimw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bWFhbGtoY2ZycGtra2p3aW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2NDAzNTQsImV4cCI6MjAzMTIxNjM1NH0.LgG2kf2rTXYU2PwMrOvPMPyM3Yud2itiOitf8zdF_uo';

const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/tasks', async (req, res) => {
    const { data, error } = await supabase
        .from('tasks')
        .select();
    if (error) {
        console.error('Erro ao obter tarefas:', error);
        return res.status(500).send(error);
    }
    res.status(200).send(data);
});

app.get('/tasks/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('tasks')
        .select()
        .eq('id', req.params.id);
    if (error) {
        console.error('Erro ao obter tarefa:', error);
        return res.status(500).send(error);
    }
    res.status(200).send(data);
});

app.post('/tasks', async (req, res) => {
    try {
        const { error } = await supabase
            .from('tasks')
            .insert({
                name: req.body.name,
                completed: req.body.completed || false,
            });
        if (error) {
            console.error('Erro ao inserir tarefa:', error);
            return res.status(500).send(error);
        }
        res.status(201).send('Tarefa criada com sucesso!');
    } catch (err) {
        console.error('Erro inesperado:', err);
        res.status(500).send(err);
    }
});

app.put('/tasks/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('tasks')
            .update({
                name: req.body.name,
                completed: req.body.completed
            })
            .eq('id', req.params.id);
        if (error) {
            console.error('Erro ao atualizar tarefa:', error);
            return res.status(500).send(error);
        }
        res.status(200).send('Tarefa atualizada com sucesso!');
    } catch (err) {
        console.error('Erro inesperado:', err);
        res.status(500).send(err);
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', req.params.id);
        if (error) {
            console.error('Erro ao deletar tarefa:', error);
            return res.status(500).send(error);
        }
        res.status(200).send('Tarefa excluída com sucesso!');
    } catch (err) {
        console.error('Erro inesperado:', err);
        res.status(500).send(err);
    }
});

app.get('/', (req, res) => {
    res.send('Hello, I am working with Supabase <3');
});

app.get('*', (req, res) => {
    res.send('Hello again, I am working to the moon and beyond <3');
});

app.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
});
