# Landlord's Super Mix Calculator

Calculadora web simples para preparar os mixes prime de **Landlord's Super** sem gerar quantidades impossíveis de medir no jogo.

## Recursos

- Receitas prime para concreto, argamassa e no-fines.
- Capacidade máxima travada em 250 L.
- Volume total ajustado para passos de 0,5 L.
- Ingredientes calculados como múltiplos de 0,5 L.
- Distribuição automática do arredondamento para manter o total escolhido.
- Deploy gratuito configurado para GitHub Pages com CI/CD via GitHub Actions.

## Fórmulas base para 250 L

| Mistura | Cimento | Agregado | Areia | Água |
| --- | ---: | ---: | ---: | ---: |
| Concreto prime | 37,5 L | 125 L | 62,5 L | 25 L |
| Argamassa prime | 37,5 L | 0 L | 187,5 L | 25 L |
| No-fines prime | 25 L | 150 L | 0 L | 75 L |

## Comandos locais

```bash
npm test
npm run build
```

O comando de build gera a pasta `dist/`, que é o artefato publicado no GitHub Pages.

## Deploy no GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` faz CI/CD automaticamente:

- Em pull requests para `main`, roda os testes e o build sem publicar.
- Em pushes para `main`, roda os testes, gera `dist/` e publica no GitHub Pages.
- Também pode ser executado manualmente pela aba **Actions** com `workflow_dispatch`.

Para ativar no GitHub:

1. Abra **Settings → Pages** no repositório.
2. Em **Build and deployment**, escolha **GitHub Actions** como source.
3. Faça push na branch `main`.
4. Aguarde o workflow **Deploy GitHub Pages** terminar.

Depois do primeiro deploy, a URL aparece no resumo do job `Deploy` e normalmente segue o formato:

```text
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/
```
