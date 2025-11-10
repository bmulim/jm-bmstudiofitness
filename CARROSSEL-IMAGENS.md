# 📸 Guia de Configuração do Carrossel de Imagens

## Como Adicionar Imagens ao Carrossel

### 1️⃣ Acessar as Configurações

- Faça login como administrador
- Vá em **Dashboard** → **Configurações do Estúdio**
- Clique na aba **"Carrossel"**

### 2️⃣ Obter URLs Diretas de Imagens

Para que as imagens funcionem corretamente, você precisa usar **URLs DIRETAS** que apontem para o arquivo de imagem.

#### ✅ URLs CORRETAS (terminam com extensão de imagem):

```
https://images2.imgbox.com/07/2d/3CRGScip_o.png
https://i.imgur.com/abc123.jpg
https://example.com/imagens/academia.jpeg
https://cdn.example.com/foto.webp
```

#### ❌ URLs INCORRETAS (páginas de visualização):

```
https://imgbox.com/3CRGScip          ❌ Página do imgbox
https://imgur.com/abc123             ❌ Página do imgur
https://example.com/galeria          ❌ Não é imagem direta
```

### 3️⃣ Como Obter URL Direta

#### **ImgBox** (https://imgbox.com)

1. Faça upload da imagem no ImgBox
2. Na página da imagem, clique com botão direito na imagem
3. Selecione **"Copiar endereço da imagem"**
4. A URL correta será algo como: `https://images2.imgbox.com/XX/XX/XXXXXXXX_o.png`

#### **Imgur** (https://imgur.com)

1. Faça upload da imagem no Imgur
2. Clique com botão direito na imagem
3. Selecione **"Copiar endereço da imagem"**
4. A URL correta será algo como: `https://i.imgur.com/XXXXXXX.jpg`

#### **Outras plataformas**

- Sempre copie o **endereço direto da imagem**
- Verifique se a URL termina com: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.bmp`

### 4️⃣ Validação Automática

O sistema valida automaticamente se a URL é válida:

- ✅ **Preview verde**: URL válida, imagem será exibida
- ⚠️ **Aviso vermelho**: URL inválida, corrija antes de salvar

### 5️⃣ Recursos do Carrossel

- **Máximo de 7 imagens**
- **Primeiras 3 imagens**: Obrigatórias (já vêm com padrão)
- **Imagens 4-7**: Opcionais
- **Rotação automática**: A cada 4 segundos
- **Hover**: Pausa ao passar o mouse
- **Responsive**: Adapta-se a todos os dispositivos

### 6️⃣ Tratamento de Erros

Se uma imagem não carregar (URL quebrada, servidor fora do ar, etc.):

- **Dashboard**: Exibe placeholder automaticamente
- **Carrossel**: Substitui por imagem padrão
- **Console**: Registra erro para debug

### 📝 Exemplo Prático

1. Acesse: https://imgbox.com
2. Faça upload de uma foto da academia
3. Na página da imagem, clique com botão direito → "Copiar endereço da imagem"
4. Cole no campo "Imagem 1" no dashboard
5. Veja o preview aparecer automaticamente
6. Clique em "Salvar Alterações"
7. Acesse a página inicial para ver o carrossel

### 🔧 Solução de Problemas

**Imagem não aparece no preview?**

- Verifique se a URL termina com extensão de imagem (.jpg, .png, etc.)
- Teste a URL abrindo em uma nova aba do navegador
- Certifique-se de que não há espaços no início/fim da URL

**Imagem funciona no preview mas não no carrossel?**

- Abra o console do navegador (F12)
- Veja se há erros relacionados à imagem
- Verifique se a URL está acessível publicamente

**Quer usar imagens locais?**

- Coloque as imagens na pasta `public/` do projeto
- Use URLs como: `/minha-imagem.jpg`

### 🎨 Dicas de Qualidade

Para melhores resultados:

- **Resolução**: Mínimo 1200x800 pixels
- **Formato**: JPG ou PNG
- **Proporção**: 3:2 (horizontal)
- **Tamanho**: Máximo 2MB por imagem
- **Qualidade**: Imagens nítidas e bem iluminadas

---

📚 **Documentação adicional**: Veja `SISTEMA-FINANCEIRO.md` para outras configurações do sistema.
