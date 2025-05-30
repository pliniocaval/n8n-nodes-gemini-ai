# Nó Gemini AI para n8n

Este é um community node para o n8n que permite interagir com a API Google Gemini diretamente nos seus workflows. Com este nó, pode facilmente integrar as capacidades de IA generativa do Gemini, como a geração de texto, nas suas automatizações.

## Funcionalidades

* **Gerar Conteúdo**: Envie um prompt de texto para um modelo Gemini especificado e receba o texto gerado.
* Configuração flexível de parâmetros de geração (temperatura, máximo de tokens, etc.).
* Opção para retornar a resposta completa da API ou apenas o texto gerado.
* Autenticação segura usando as credenciais do n8n para a sua API Key do Gemini.

*(Mais funcionalidades como chat, visão e embeddings podem ser adicionadas no futuro).*

## Pré-requisitos

* Uma instância do n8n a correr (versão 1.0.0 ou superior recomendada).
* Uma API Key válida do Google Gemini. Pode obter uma no [Google AI Studio](https://ai.google.dev/docs/api_setup).

## Instalação

Existem algumas formas de instalar community nodes no n8n:

1.  **Instalação via npm (para instâncias auto-hospedadas):**
    Se estiver a executar o n8n via npm ou Docker e tiver acesso ao ambiente, pode instalar o nó diretamente:
    ```bash
    npm install n8n-nodes-gemini # (Substitua pelo nome real do pacote se for diferente)
    ```
    Depois, reinicie a sua instância do n8n.

2.  **Instalação Manual (para instâncias auto-hospedadas):**
    * Clone o repositório deste nó (ou descarregue o código-fonte).
    * Compile o nó (normalmente com `npm run build`).
    * Copie a pasta `dist` resultante para a pasta de community nodes da sua instalação do n8n. O caminho típico é `~/.n8n/custom/` ou o definido pela variável de ambiente `N8N_CUSTOM_EXTENSIONS_DIR`.
    * Reinicie a sua instância do n8n.

3.  **Usar com n8n-desktop:**
    * Siga as instruções do n8n-desktop para adicionar community nodes. Geralmente, envolve colocar o nó compilado no diretório apropriado.

Consulte a [documentação oficial do n8n sobre community nodes](https://docs.n8n.io/integrations/community-nodes/installation/) para obter as instruções mais detalhadas.

## Configuração

1.  **Adicionar Credenciais do Gemini API:**
    * No seu painel do n8n, vá para "Credentials".
    * Clique em "Add credential".
    * Procure por "Gemini API" (ou o `displayName` que definiu nas suas credenciais) e selecione-o.
    * Insira a sua API Key do Gemini no campo fornecido.
    * Guarde as credenciais.

2.  **Usar o Nó Gemini AI no Workflow:**
    * No editor de workflows, adicione um novo nó.
    * Procure por "Gemini AI" (ou o `displayName` do seu nó).
    * Selecione o nó para adicioná-lo ao seu workflow.
    * No painel de parâmetros do nó:
        * Selecione as credenciais do Gemini API que acabou de configurar.
        * Escolha a **Operação** desejada (por exemplo, "Generate Content").
        * Preencha os campos específicos da operação, como **Model** e **Prompt**.
        * Ajuste as **Generation Configuration (Optional)** conforme necessário.
        * Decida se quer a **Return Full Response**.

## Operações Disponíveis

### Generate Content

Esta operação permite gerar texto com base num prompt fornecido.

* **Model**: Selecione o modelo Gemini que deseja usar (ex: `gemini-1.5-flash-latest`, `gemini-1.0-pro`).
* **Prompt**: O texto de entrada que o modelo usará para gerar a resposta.
* **Generation Configuration (Optional)**:
    * **Temperature**: Controla a aleatoriedade da saída. Valores mais altos (ex: 0.9) tornam a saída mais aleatória, enquanto valores mais baixos (ex: 0.2) a tornam mais determinística. (Intervalo: 0.0 - 2.0)
    * **Max Output Tokens**: O número máximo de tokens que serão gerados na resposta.
    * **Top P**: Parâmetro para amostragem nucleus. (Intervalo: 0.0 - 1.0)
    * **Top K**: Parâmetro para amostragem top-k.
* **Return Full Response**: Se marcado, o nó retornará o objeto JSON completo da API do Gemini. Caso contrário, retornará um objeto simplificado contendo apenas o texto gerado (ou um erro, se aplicável).

## Exemplo de Workflow

1.  **Start Node**: Inicia o workflow.
2.  **Gemini AI Node**:
    * Credenciais: Selecione as suas credenciais do Gemini.
    * Operação: `Generate Content`
    * Model: `gemini-1.5-flash-latest`
    * Prompt: `Escreva um poema curto sobre a exploração espacial.`
3.  **Set Node (Opcional)**: Para manipular ou usar o `generatedText` do output do nó Gemini.

## Roadmap Futuro

* Adicionar suporte para operações de chat (conversas multi-turn).
* Integrar capacidades de visão (processar imagens com prompts).
* Adicionar operação para gerar embeddings de texto.
* Melhorar o tratamento de erros e feedback da API.

## Contribuir

Contribuições são bem-vindas! Se tiver sugestões, correções de bugs ou novas funcionalidades que gostaria de adicionar, sinta-se à vontade para:

1.  Abrir uma issue para discutir as suas ideias.
2.  Fazer um fork do repositório.
3.  Criar um branch para a sua funcionalidade (`git checkout -b feature/nova-funcionalidade`).
4.  Fazer commit das suas alterações (`git commit -am 'Adiciona nova funcionalidade'`).
5.  Fazer push para o branch (`git push origin feature/nova-funcionalidade`).
6.  Abrir um Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja `LICENSE` para mais detalhes.
