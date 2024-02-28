// Função para exibir o mês atual
function displayCurrentMonth() {
    const now = new Date();
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const currentMonth = months[now.getMonth()];
    document.getElementById("currentMonth").textContent = `${currentMonth} de ${now.getFullYear()}`;
}

// Função para baixar todos os arquivos do mês
async function downloadAllFiles() {
    try {
        alert("Criando pasta e baixando todos os arquivos do mês...");

        // Lógica para obter a lista de imagens do backend
        const images = await getImagesFromBackend();

        // Criar uma pasta com o nome do mês e ano
        const now = new Date();
        const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const currentMonth = months[now.getMonth()];
        const folderName = `${currentMonth}_${now.getFullYear()}`;

        // Criar um objeto JSZip
        const zip = new JSZip();

        // Lógica para baixar cada imagem dentro da pasta e adicionar ao ZIP
        for (const imageName of images) {
            const imageElement = document.createElement("img");
            imageElement.src = imageName;

            // Adicionar a imagem ao ZIP
            const imgData = await fetch(imageName).then(res => res.blob());
            zip.file(`${folderName}/${imageName}.jpeg`, imgData);
        }

        // Criar o arquivo ZIP
        const content = await zip.generateAsync({ type: "blob" });

        // Criar um link temporário para iniciar o download do ZIP
        const folderLink = document.createElement('a');
        folderLink.href = URL.createObjectURL(content);
        folderLink.download = `${folderName}.zip`; // Nome do arquivo ZIP
        document.body.appendChild(folderLink);
        folderLink.click();
        document.body.removeChild(folderLink);

        alert("Download concluído!");
    } catch (error) {
        console.error('Erro ao baixar todos os arquivos do mês:', error);
    }
}

// Função para baixar uma imagem individual
function downloadImage(imageName) {
    // Lógica para baixar a imagem individual
    const imageElement = document.createElement("img");
    imageElement.src = imageName;

    // Criar um link temporário para iniciar o download
    const a = document.createElement('a');
    a.href = imageName;
    a.download = `${imageName}.jpeg`; // Nome do arquivo a ser baixado
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Função para enviar imagem para o servidor
async function sendImageToServer(imageData) {
    try {
        const formData = new FormData();
        formData.append('image', imageData);

        const response = await fetch('https://pag-de-desen.vercel.app/', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        console.log('Imagem enviada para o servidor:', data.imageUrl);

        
        // Se necessário, chame a função displayImages()
        displayImages();
    } catch (error) {
        console.error('Erro ao enviar imagem para o servidor:', error);
    }
}

// Função para obter a lista de imagens do backend
async function getImagesFromBackend() {
    try {
        // Substitua '/api/images' pela rota real do seu backend
        const response = await fetch('https://pag-de-desen.vercel.app/', {
            method: 'GET',  // Ou o método correto para obter as imagens
        });

        const data = await response.json();
        return data.images || [];
    } catch (error) {
        console.error('Erro ao obter imagens do backend:', error);
        return [];
    }
}


// Função para exibir as imagens na lista
async function displayImages() {
    try {
        const images = await getImagesFromBackend();
        const imageList = document.getElementById("imageList");

        // Limpar a lista de imagens antes de exibir as novas
        imageList.innerHTML = '';

        images.forEach((imageName) => {
            const imageElement = document.createElement("img");
            imageElement.src = imageName;
            imageList.appendChild(imageElement);

            const downloadButton = document.createElement("button");
            downloadButton.textContent = `Baixar ${imageName}`;
            downloadButton.addEventListener("click", () => downloadImage(imageName));
            imageList.appendChild(downloadButton);
        });
    } catch (error) {
        console.error('Erro ao exibir imagens:', error);
    }
}

// Adicionar evento de clique ao botão de baixar todos os arquivos
document.getElementById("downloadAll").addEventListener("click", downloadAllFiles);

// Chamar a função para exibir as imagens ao carregar a página
displayCurrentMonth();
displayImages();

