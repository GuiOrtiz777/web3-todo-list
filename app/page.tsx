"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, CheckCircle2, Clock, ListTodo, Coins, Plus, Calendar, AlertCircle } from "lucide-react"

interface Task {
  id: string
  name: string
  description: string
  status: "pending" | "completed"
  createdAt: Date
  completedAt?: Date
  weiValue: number
}

export default function Web3TodoApp() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "Estudar Smart Contracts",
      description: "Aprender sobre desenvolvimento de contratos inteligentes em Solidity",
      status: "completed",
      createdAt: new Date("2024-01-15"),
      completedAt: new Date("2024-01-20"),
      weiValue: 1000000000000000000, // 1 ETH em wei
    },
    {
      id: "2",
      name: "Implementar DApp",
      description: "Desenvolver aplicação descentralizada para gerenciamento de tarefas",
      status: "pending",
      createdAt: new Date("2024-01-18"),
      weiValue: 500000000000000000, // 0.5 ETH em wei
    },
    {
      id: "3",
      name: "Deploy na Testnet",
      description: "Fazer deploy do contrato na rede de teste Ethereum",
      status: "pending",
      createdAt: new Date("2024-01-20"),
      weiValue: 250000000000000000, // 0.25 ETH em wei
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    weiValue: "",
  })

  const connectWallet = async () => {
    setIsConnecting(true)
    // Simular conexão com carteira
    setTimeout(() => {
      setIsWalletConnected(true)
      setIsConnecting(false)
    }, 2000)
  }

  const disconnectWallet = () => {
    setIsWalletConnected(false)
  }

  const createTask = () => {
    if (!newTask.name.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      name: newTask.name,
      description: newTask.description,
      status: "pending",
      createdAt: new Date(),
      weiValue: Number.parseFloat(newTask.weiValue) * 1000000000000000000 || 0,
    }

    setTasks([...tasks, task])
    setNewTask({ name: "", description: "", weiValue: "" })
    setIsDialogOpen(false)
  }

  const completeTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: "completed" as const, completedAt: new Date() } : task,
      ),
    )
  }

  const metrics = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    totalWei: tasks.reduce((sum, task) => sum + task.weiValue, 0),
  }

  const formatWei = (wei: number) => {
    return (wei / 1000000000000000000).toFixed(4) + " ETH"
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">WEB3 TODO</h1>
            <Button
              onClick={isWalletConnected ? disconnectWallet : connectWallet}
              disabled={isConnecting}
              className={`${
                isWalletConnected ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
              } text-white transition-all duration-200`}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isConnecting ? "Conectando..." : isWalletConnected ? "Carteira Conectada" : "Conectar Carteira"}
            </Button>
          </div>

          {!isWalletConnected && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Conecte sua carteira para gerenciar suas tarefas na blockchain.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Métricas */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-slate-200 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total de Tarefas</CardTitle>
                <ListTodo className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{metrics.total}</div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Tarefas Concluídas</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{metrics.completed}</div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Tarefas Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{metrics.pending}</div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Wei em Stake</CardTitle>
                <Coins className="h-4 w-4 text-violet-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{formatWei(metrics.totalWei)}</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Seção de Tarefas */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Tarefas</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                  disabled={!isWalletConnected}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Criar Nova Tarefa</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome da Tarefa</Label>
                    <Input
                      id="name"
                      value={newTask.name}
                      onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                      placeholder="Digite o nome da tarefa"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Descreva a tarefa"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="wei">Valor em ETH</Label>
                    <Input
                      id="wei"
                      type="number"
                      step="0.0001"
                      value={newTask.weiValue}
                      onChange={(e) => setNewTask({ ...newTask, weiValue: e.target.value })}
                      placeholder="0.0000"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={createTask} className="bg-blue-600 hover:bg-blue-700">
                    Criar Tarefa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {tasks.length === 0 ? (
              <Card className="border-slate-200">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <ListTodo className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">Nenhuma tarefa encontrada</p>
                    <p className="text-sm text-slate-400 mt-1">Crie sua primeira tarefa para começar</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              tasks.map((task) => (
                <Card
                  key={task.id}
                  className={`border-slate-200 hover:shadow-md transition-all duration-200 ${
                    task.status === "completed" ? "bg-emerald-50 border-emerald-200" : "bg-white"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className={`font-semibold ${
                              task.status === "completed" ? "text-emerald-800 line-through" : "text-slate-900"
                            }`}
                          >
                            {task.name}
                          </h3>
                          <Badge
                            variant={task.status === "completed" ? "default" : "secondary"}
                            className={
                              task.status === "completed"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                : "bg-cyan-100 text-cyan-800 hover:bg-cyan-100"
                            }
                          >
                            {task.status === "completed" ? "Concluída" : "Pendente"}
                          </Badge>
                        </div>

                        <p
                          className={`text-sm mb-3 ${
                            task.status === "completed" ? "text-emerald-700" : "text-slate-600"
                          }`}
                        >
                          {task.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Criada em {formatDate(task.createdAt)}</span>
                          </div>
                          {task.completedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Concluída em {formatDate(task.completedAt)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Coins className="h-3 w-3" />
                            <span>{formatWei(task.weiValue)}</span>
                          </div>
                        </div>
                      </div>

                      {task.status === "pending" && (
                        <Button
                          onClick={() => completeTask(task.id)}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
                          disabled={!isWalletConnected}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Concluir
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
