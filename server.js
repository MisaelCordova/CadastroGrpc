const proto = "./proto/pacientes.proto"
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const {v4:uuidv4} = require('uuid')

const packageDefinition = protoLoader.loadSync(proto,{
    keepCase:true,
    longs:String,
    enums:String,
    arrays:true
})

const pacientesProto = grpc.loadPackageDefinition(packageDefinition)

const server = new grpc.Server()
//banco
const pacientes = [
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        nome:"Misael Córdova",
        cartaoSus: "7012939128903810",
        dataNascimento: "2000-07-28"
    },
    {
        id:"a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        name: "Renan Coral",
        cartaoSus: "7912321839012",
        dataNascimento:"1999-05-26"
    }
]
server.addService(pacientesProto.PacienteService.service,{
    getAll:(_,callback)=>{
        callback(null, {pacientes})
    },
    get:(call,callback)=>{
        let paciente = pacientes.find(n=>n.id==call.request.id)

        if(paciente){
            callback(null,paciente)
        } else {
            callback({
                code:grpc.status.NOT_FOUND,
                details:"Paciente não Encontrado"
            })
        }
    },

    insert:(call,callback)=>{
        let paciente = call.request

        paciente.id = uuidv4()
        pacientes.push(paciente)
        callback(null,paciente)
    },

    update:(call, callback)=>{
        let novoPaciente = paciente.find(n=>n.id == call.request.id)

        if(novoPaciente){
            novoPaciente.nome = call.request.nome
            novoPaciente.cartaoSus = call.request.cartaoSus
            novoPaciente.dataNascimento = call.request.dataNascimento
            callback(null, novoPaciente)
        } else {
            callback({
                code:grpc.status.NOT_FOUND,
                details:"Paciente não encontrado"
            })
        }
    },
    remove: (call,callback)=>{
        let id = pacientes.findIndex(n=> n.id ==call.request.id)

        if(id !=-1){
            pacientes.splice(id,1)
            callback(null,{})
        } else {
            callback({
                code:grpc.status.NOT_FOUND,
                details:"Paciente não encontrado"
            })
        }
    }
})
server.bind("127.0.0.1:30011",grpc.ServerCredentials.createInsecure())
console.log("Servidor rodando na porta 30011")
server.start();
