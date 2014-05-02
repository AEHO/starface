## 1.  Usuário deve se logar na nossa aplicação

>   HTML com login normal. Obtemos então o acessToken to mesmo (usaremos para fazer os requests na API)

Como o node-webkit irá inicializar o arquivo tendo um domínio não fixo (isto é, diferente daquele passado como URL da aplicação no *dev.facebook*) não conseguimos então utilizar a API normal de login do facebook.

Uma solução é então instanciarmos uma `window` filha de modo que possamos então jogar o usuário para o fluxo como esperado.
