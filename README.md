# 📰 Blogging Platform - Microservices Architecture

Este repositório contém uma aplicação de plataforma de blogging modularizada em **microsserviços**, reestruturada para promover escalabilidade, manutenibilidade e automação com **Clean Architecture**, **DevOps** e **observabilidade**.

## 📌 Objetivo

Reestruturar uma aplicação de blogging para:

- Separar responsabilidades entre serviços (auth, users, posts)
- Utilizar arquitetura de microsserviços
- Aplicar princípios da Clean Architecture
- Automatizar testes e deploys com CI/CD
- Monitorar métricas e logs com Prometheus + Grafana
- Preparar para execução em ambiente de nuvem

---

## 🧱 Estrutura do Projeto

```bash
D:\hackathon-full-stack
├── auth-service        # Serviço de autenticação (login, tokens, JWT)
├── user-service        # Serviço de gerenciamento de usuários e autores
└── post-service        # Serviço de postagens (CRUD de posts)
