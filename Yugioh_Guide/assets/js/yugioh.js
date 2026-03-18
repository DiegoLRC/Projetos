/**
 * ===================================================
 * ARQUIVO: yugioh.js
 * 
 * Este arquivo interage com a API Yu-Gi-Oh! e
 * é responsável por:
 * 1. Buscar cartas na API
 * 2. Exibir cartas na tela
 * 3. Mostrar detalhes de uma carta específica
 * 
 * API: https://ygoprodeck.com/api/ (super útil!)
 * ===================================================
 */

// URL base da API Yu-Gi-Oh!
const API_BASE = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

/**
 * FUNÇÃO 1: Buscar cartas na API
 * 
 * Recebe um texto (ex: "Blue Eyes") e busca na API
 * Retorna um array com as cartas encontradas
 * 
 * @param {string} query - O nome da carta a buscar (pode ser parcial)
 * @returns {Promise<Array>} - Array com objetos de cartas encontradas
 * 
 * Exemplo:
 * const cartas = await searchCards('Blue Eyes');
 * console.log(cartas); // [ { name: 'Blue-Eyes White Dragon', ... }, ... ]
 */
export async function searchCards(query) {
  // Garante que a busca não seja vazia
  if (!query.trim()) return [];

  // Monta a URL da API com o parâmetro de busca
  // encodeURIComponent() previne problemas com caracteres especiais
  const url = `${API_BASE}?fname=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    
    // Verifica se a requisição foi bem-sucedida (status 200-299)
    if (!response.ok) {
      throw new Error(`❌ Erro HTTP: ${response.status}`);
    }
    
    // Converte a resposta JSON em objetos JavaScript
    const data = await response.json();
    
    // Retorna o array de cartas (ou array vazio se não encontrar)
    return data.data || [];
  } catch (error) {
    console.error('❌ Falha ao buscar cartas:', error);
    return []; // Retorna array vazio em caso de erro
  }
}

/**
 * FUNÇÃO 2: Exibir as cartas na tela
 * 
 * Recebe um array de cartas e cria cards HTML
 * para cada uma, inserindo no elemento #results
 * 
 * @param {Array} cards - Array de cartas para exibir
 * 
 * Exemplo:
 * const cartas = await searchCards('Blue Eyes');
 * renderCards(cartas); // Exibe as cartas na página
 */
export function renderCards(cards) {
  const resultsDiv = document.getElementById('results');

  // Se não encontrou cartas, exibe mensagem
  if (!cards || cards.length === 0) {
    resultsDiv.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1 / -1;">❌ Nenhuma carta encontrada. Tente outro nome!</p>';
    return;
  }

  // Cria o HTML de cada carta
  let html = '';
  cards.forEach(card => {
    // Pega a imagem pequena da carta (sempre existe na API)
    const imageUrl = card.card_images?.[0]?.image_url_small || 'https://via.placeholder.com/150?text=Sem+Imagem';
    const cardName = card.name || 'Sem nome';
    const cardType = card.type || 'Desconhecido';
    const cardId = card.id || 'unknown';

    html += `
      <div class="card-item" onclick="showCardDetails(${cardId})">
        <img src="${imageUrl}" alt="${cardName}" loading="lazy" />
        <div class="card-info">
          <h3>${cardName}</h3>
          <p class="card-type">${cardType}</p>
        </div>
      </div>
    `;
  });

  // Insere o HTML no div de resultados
  resultsDiv.innerHTML = html;
}

/**
 * FUNÇÃO 3: Exibir detalhes de uma carta
 * 
 * Quando clica em uma carta, busca todos os detalhes
 * e exibe em um alert (pode melhorar com modal depois)
 * 
 * @param {number} cardId - ID único da carta na API
 * 
 * Exemplo:
 * showCardDetails(6983839); // Mostra detalhes da carta 6983839
 */
window.showCardDetails = async function(cardId) {
  try {
    // Busca detalhes completos da carta
    const url = `${API_BASE}?id=${cardId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao carregar detalhes');
    
    const data = await response.json();
    const card = data.data?.[0];
    if (!card) {
      alert('Carta não encontrada');
      return;
    }

    // Extrai informações da carta
    const cardName = card.name || 'Desconhecido';
    const cardDesc = card.desc || 'Sem descrição';
    const cardType = card.type || 'Desconhecido';
    const cardRace = card.race || 'N/A';
    const cardAttack = card.atk !== undefined ? card.atk : 'N/A';
    const cardDefense = card.def !== undefined ? card.def : 'N/A';

    // Cria um alert simples com informações da carta
    let details = `
📊 ${cardName}
━━━━━━━━━━━━━━━━━━
Tipo: ${cardType}
Raça: ${cardRace}
⚔️  ATK: ${cardAttack}  |  🛡️  DEF: ${cardDefense}
━━━━━━━━━━━━━━━━━━
Descrição:
${cardDesc}
    `.trim();
    
    alert(details);
  } catch (error) {
    console.error('❌ Erro ao carregar detalhes da carta:', error);
    alert('Erro ao carregar detalhes da carta');
  }
};
