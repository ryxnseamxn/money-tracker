// import logo from './logo.svg';
import React from 'react';
import './App.css';
import {useEffect} from "react"; 

function App() {
  const [name,setName] = React.useState(''); 
  const [datetime, setDatetime] = React.useState('');
  const [description, setDescription] = React.useState(''); 
  const [transactions, setTransactions] = React.useState([]); 
  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);
  async function getTransactions(){
    const url = `${process.env.REACT_APP_API_URL}/transactions`;
    const response = await fetch(url);  
    const json = await response.json(); 
    return json
  }
  function addNewTransaction(ev){
    ev.preventDefault(); 
    const url = `${process.env.REACT_APP_API_URL}/transaction`;
    const price = name.split(' ')[0]; 
    fetch(url, {
      method: 'POST', 
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({
        price,
        name: name.substring(price.length+1), 
        description, 
        datetime
      })
    }).then(response => {
      response.json().then(json => {
        setName('');
        setDatetime('');
        setDescription(''); 
        window.location.reload();
      });
    });
  }
  let balance = 0;
  for(const transaction of transactions){
    balance = balance + transaction.price; 
  }
  balance = balance.toFixed(2); 
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0]; 
  return (
    <main>
      <h1>${balance}<span>{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input 
          type="text" 
          placeholder={'+$200 Fossil Watch'}
          value={name}
          onChange={ev => setName(ev.target.value)}/>
          <input 
          value={datetime} 
          onChange={ev => setDatetime(ev.target.value)} 
          type="datetime-local"/>
        </div>
        <div className="description">          
          <input 
          type="text" 
          value={description}
          onChange={ev => setDescription(ev.target.value)}
          placeholder={'description'}/>
        </div>
        <button type="submit">Add New Transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 && transactions.map(transaction => (
            <div className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
            </div>
            {console.log(transaction.price)}
            <div className="right">
              <div className={"price " +(transaction.price<0?'red':'green')}>{transaction.price}</div>
              <div className={"datetime"}>{transaction.datetime}</div>
            </div>
          </div>       
        ))}
      </div>
    </main>
  );
}

export default App;
