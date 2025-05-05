import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const Stocks = () => {
  const [ticker, setTicker] = useState('');
  const [days, setDays] = useState(30);
  const [chartData, setChartData] = useState(null);
  const [topStocks, setTopStocks] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    fetchTopRedditStocks();
  }, []);

  const fetchTopRedditStocks = async () => {
    const res = await fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03');
    const data = await res.json();
    setTopStocks(data.slice(0, 5));
  };

  const fetchStockData = async (symbol, range = 30) => {
    const apiKey = 'oCRBHkPj8T701cBzXtqoEQf9KCQU8K36';
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - range);
    const fromDate = from.toISOString().split('T')[0];
    const toDate = to.toISOString().split('T')[0];

    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;
    const res = await fetch(url);
    const json = await res.json();

    const labels = json.results.map(p => new Date(p.t).toLocaleDateString());
    const prices = json.results.map(p => p.c);

    setChartData({
      labels,
      datasets: [{
        label: `${symbol} Closing Priceas`,
        data: prices,
        fill: false,
        borderColor: 'blue'
      }]
    });
  };

  const handleLookup = () => {
    fetchStockData(ticker.toUpperCase(), days);
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      if (transcript.toLowerCase().startsWith('lookup')) {
        const parts = transcript.split(' ');
        if (parts.length >= 2) {
          const symbol = parts[1].toUpperCase();
          setTicker(symbol);
          fetchStockData(symbol, 30);
        }
      }
    };

    if (listening) recognition.start();
    else recognition.stop();

    return () => recognition.stop();
  }, [listening]);

  return (
    <div style={{ backgroundColor: '#ccffcc', padding: '1em' }}>
      <h1>Stocks Page</h1>
      <div>
        <input
          type="text"
          placeholder="Enter stock ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
        <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
          <option value={30}>30 days</option>
          <option value={60}>60 days</option>
          <option value={90}>90 days</option>
        </select>
        <button style={{ backgroundColor: '#ffa500', color: 'black', border: 'none', padding: '0.5em' }} onClick={handleLookup}>Lookup</button>
        <button onClick={() => setListening(!listening)} style={{ marginLeft: '1em' }}>
          {listening ? 'Turn Off Listening' : 'Turn On Listening'}
        </button>
      </div>

      {chartData && <Line data={chartData} />}

      <h2>Top 5 Reddit Stocks</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Comments</th>
            <th>Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {topStocks.map(stock => (
            <tr key={stock.ticker}>
              <td>
                <a href={`https://finance.yahoo.com/quote/${stock.ticker}`} target="_blank" rel="noreferrer">
                  {stock.ticker}
                </a>
              </td>
              <td>{stock.no_of_comments}</td>
              <td>
                {stock.sentiment === 'Bullish' ? '📈 Bullish' : stock.sentiment === 'Bearish' ? '📉 Bearish' : stock.sentiment}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stocks;
