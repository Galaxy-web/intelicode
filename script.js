const { useState, useEffect } = React;
const { render } = ReactDOM;

function FAQ() {
  const [questions, setQuestions] = useState([
    { id: 1, question: 'O que é inteligência artificial?', answer: null },
    { id: 2, question: 'Como a IA funciona?', answer: null },
    // Adicione mais perguntas conforme necessário
  ]);

  const fetchAnswer = async (question) => {
    // Substitua 'SUA_CHAVE_DE_API' pela sua chave de API OpenAI
    const apiKey = 'SUA_CHAVE_DE_API';
    const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: question,
          max_tokens: 150,
        }),
      });

      const data = await response.json();

      return data.choices[0].text.trim();
    } catch (error) {
      console.error('Erro ao obter resposta da API:', error);
      return 'Erro ao obter resposta.';
    }
  };

  const toggleAnswer = async (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map(async (q) => {
        if (q.id === questionId) {
          q.answer = await fetchAnswer(q.question);
        }
        return q;
      })
    );
  };

  useEffect(() => {
    // Pré-carregue respostas para todas as perguntas
    questions.forEach((q) => {
      toggleAnswer(q.id);
    });
  }, []); // Executa apenas uma vez ao montar o componente

  return (
    <div>
      {questions.map((q) => (
        <div key={q.id} className="faq">
          <h3 onClick={() => toggleAnswer(q.id)}>{q.question}</h3>
          {q.answer && <p className="answer">{q.answer}</p>}
        </div>
      ))}
    </div>
  );
}

render(<FAQ />, document.getElementById('root'));
