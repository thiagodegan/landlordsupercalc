# Landlord's Super Mix Calculator

Calculadora web simples para preparar os mixes prime de **Landlord's Super** sem gerar quantidades impossíveis de medir no jogo.

## Recursos

- Receitas prime para concreto, argamassa e no-fines.
- Capacidade máxima travada em 250 L.
- Volume total ajustado para passos de 0,5 L.
- Ingredientes calculados como múltiplos de 0,5 L.
- Distribuição automática do arredondamento para manter o total escolhido.

## Fórmulas base para 250 L

| Mistura | Cimento | Agregado | Areia | Água |
| --- | ---: | ---: | ---: | ---: |
| Concreto prime | 37,5 L | 125 L | 62,5 L | 25 L |
| Argamassa prime | 37,5 L | 0 L | 187,5 L | 25 L |
| No-fines prime | 25 L | 150 L | 0 L | 75 L |

## Comandos

```bash
npm test
npm run build
```
