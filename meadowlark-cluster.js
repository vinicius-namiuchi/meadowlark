const cluster = require('cluster')

function startWorker() {
    const worker = cluster.fork()
    console.log(`CLUSTER: Worker $[worker.id] iniciado`)
}

if(cluster.isMaster) {
    require('os').cpus().forEach(startWorker)

    // registra workers que se desconectaram. Se um worker se desconectar,
    // ele deve ser encerrado, logo, esperaremos o evento de encerramento
    // para gerar um novo worker para substituí-lo
    cluster.on('Disconectado', worker => console.log(
        `CLUSTER: Worker ${worker.id} desconectado do cluster.`
    ))

    //quando um worker fica inativo (é encerrado),
    // criar um worker para substituí-lo
    cluster.on('Sair', (worker, code, signal) => {
        console.log(
            `CLUSTER: Worker ${worker.id} encerrou com o código ${code} (${signal})`
        )
        startWorker()
    })
}else{
    const port = process.envPORT || 3000
    //inicia nosso aplicativo no worker. consulte meadowlark.js
    require('./meadowlark.js')(port)
}