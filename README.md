## 🧑‍⚕️ Sistema de Cadastro de Pacientes e Prontuários - ONG Caminhar

Este repositório contém o **código-fonte do *Back-End* (Servidor)** do sistema desenvolvido para a **ONG Caminhar**.

O sistema tem como principal objetivo gerenciar e organizar o **cadastro de pacientes** e seus respectivos **prontuários**, facilitando a administração e o acompanhamento dos atendimentos realizados pela ONG.

---

### 💻 Tecnologias Utilizadas no *Back-End*

O *Back-End* desta aplicação foi construído utilizando um *stack* robusto e amplamente adotado no mercado, garantindo **performance**, **segurança**, e **manutenibilidade**.

| Categoria | Tecnologia | Versão Principal | Descrição |
| :--- | :--- | :--- | :--- |
| **Linguagem de Programação** | **Java** | 17 | Linguagem principal para desenvolvimento. |
| **Framework** | **Spring Boot** | 3.2.1 | Utilizado para criar o servidor de forma rápida e eficiente, seguindo o padrão RESTful. |
| **Banco de Dados** | **PostgreSQL** | (Configurável) | Sistema de gerenciamento de banco de dados relacional (SGBD) para armazenamento persistente. |
| **Persistência** | **Spring Data JPA** | Integrado ao Spring Boot | Abstração para manipulação de dados, facilitando a interação com o PostgreSQL. |
| **Segurança** | **Spring Security** | Integrado ao Spring Boot | Framework robusto para controle de acesso. |
| **Autenticação** | **JWT (JSON Web Token)** | (Dependência) | Utilizado em conjunto com o Spring Security para gerar e validar tokens de acesso seguro nas requisições da API. |
| **Dependência do Banco de Dados** | **PostgreSQL Driver (JDBC)** | 42.6.0 | *Driver* necessário para que o Java se comunique com o banco de dados PostgreSQL. |
| **Gerenciador de Dependências** | **Maven** | (Integrado ao IDE/Projeto) | Usado para gerenciar as dependências do projeto e o ciclo de vida da construção (*build*). |
| **Documentação da API** | **OpenAPI (Swagger UI)** | Integrado ao Spring Boot | Ferramenta para documentar e testar os *endpoints* da API. |

---

### 🚀 Funcionalidades Principais (do *Back-End*)

O servidor é responsável por expor os *endpoints* (rotas) necessários para que o *Front-End* possa interagir com os dados.

* **Cadastro e Gestão de Pacientes:** Criação, leitura, atualização e exclusão (*CRUD*) das informações dos pacientes.
* **Gestão de Prontuários:** Criação e manutenção dos registros de atendimento e histórico médico de cada paciente.
* **Autenticação e Autorização:** Gerenciamento de acesso seguro, onde o **JWT** é usado para autenticar usuários após o login e garantir que apenas usuários válidos acessem os dados.
* **Validação de Dados:** Garantir que os dados inseridos (ex: CPF, datas) estejam corretos e no formato adequado.

---

### 🌐 Estrutura de *Endpoints* (API REST)

A API segue o padrão **RESTful**, utilizando métodos HTTP padrão (GET, POST, PUT, DELETE) para realizar as operações de **CRUD** (Criar, Ler, Atualizar, Deletar) nos recursos principais.

| Recurso | Método HTTP | Rota (Endpoint) | Descrição |
| :--- | :--- | :--- | :--- |
| **Autenticação** | `POST` | `/auth/login` | **Autentica** o usuário e **retorna o JWT**. |
| **Pacientes** | `POST` | `/pacientes` | **Cria** um novo registro de paciente (Requer JWT). |
| **Pacientes** | `GET` | `/pacientes` | **Lista** todos os pacientes cadastrados (Requer JWT). |
| **Pacientes** | `GET` | `/pacientes/{id}` | **Busca** e retorna os dados de um paciente específico pelo seu ID (Requer JWT). |
| **Pacientes** | `PUT` | `/pacientes/{id}` | **Atualiza** completamente os dados de um paciente existente pelo seu ID (Requer JWT). |
| **Pacientes** | `DELETE` | `/
