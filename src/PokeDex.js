import "./App.css";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import Modal from "react-modal";
import "./PokeDex.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "black",
    color: "white",
  },
  overlay: { backgroundColor: "grey" },
};

function PokeDex() {
  const [pokemons, setPokemons] = useState({});
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [url, setUrl] = useState(`https://pokeapi.co/api/v2/pokemon?limit=5&offset=0`);

  useEffect(() => {
    const fetchPokemons = async () => {
      const pokemons = await axios.get(url);
      console.log(pokemons.data);
      setPokemons(pokemons.data);
      setIsLoading(false);
    };
    fetchPokemons();
  }, [url]);

  const searchPokemon = (event) => {
    const text = event.target.value.toLowerCase();
    const copy_pokemons = [...pokemons.results];
    const filtered = copy_pokemons.results.filter(pokemon => pokemon.name.toLowerCase().indexOf(text) > - 1);
    setFilteredPokemons(filtered);
  }

  if (!isLoading && pokemons?.results?.length === 0) {
    return (
      <div>
        <header className="App-header">
          <h1>Welcome to pokedex !</h1>
          <h2>Requirement:</h2>
          <ul>
            <li>
              Call this api:https://pokeapi.co/api/v2/pokemon to get pokedex, and show a list of pokemon name.
            </li>
            <li>Implement React Loading and show it during API call</li>
            <li>when hover on the list item , change the item color to yellow.</li>
            <li>when clicked the list item, show the modal below</li>
            <li>
              Add a search bar on top of the bar for searching, search will run
              on keyup event
            </li>
            <li>Implement sorting and pagingation</li>
            <li>Commit your codes after done</li>
            <li>If you do more than expected (E.g redesign the page / create a chat feature at the bottom right). it would be good.</li>
          </ul>
        </header>
      </div>
    );
  }

  const onOpenModal = (detail) => {
    setOpenModal(true);
    setPokemonDetail(detail)
  }

  const onCloseModal = () => {
    setOpenModal(false);
    setPokemonDetail(null)
  }

  return (
    <div>
      <header className="App-header">
        <input 
          type="search" 
          className="search-bar" 
          placeholder="Search your favourite pokemon" 
          onChange={searchPokemon} 
        />
        {isLoading ? (
          <>
            <div className="App">
              <header className="App-header">
              <ReactLoading />
              </header>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome to pokedex !</h1>
            <b>Implement Pokedex list here</b>
            <ul className="list">
              {filteredPokemons.length ? filteredPokemons?.map((pokemon, idx) => (
                <li className="item" key={idx} onClick={onOpenModal.bind(null, pokemon)}>
                  <span>{pokemon.name}</span>
                </li>
              )): pokemons?.results?.map((pokemon, idx) => (
                <li className="item" key={idx} onClick={onOpenModal.bind(null, pokemon)}>
                  <span>{pokemon.name}</span>
                </li>
              ))}
            </ul>
            <div>
              <button onClick={() => setUrl(pokemons.previous ?? url)} disabled={!pokemons.previous}>Previous</button>
              <button onClick={() => setUrl(pokemons.next)} disabled={!pokemons.next}>Next</button>
            </div>
          </>
        )}
      </header>
      {openModal && (
        <Modal
          isOpen={openModal}
          onRequestClose={onCloseModal}
          style={customStyles}
          ariaHideApp={false}
        >
          <ModalContent url={pokemonDetail?.url} />
        </Modal>
      )}
    </div>
  );
}

export default PokeDex;

function ModalContent({url}) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!url) return;
    const get = async () => {
      const res = await axios.get(url.toString());
      console.log(res.data);
      setData(res.data);
    }
    get();
  }, [url]);
  
  if (!data) return <div>No Data Found</div>

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <img src={data.sprites?.front_default} />
      <table>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Base Stat</th>
          </tr>
        </thead>
      <tbody>
      {data.stats?.map((stat, index) => {
        return ( 
          <tr key={index}>
            <td>{stat.stat.name}</td>
            <td>{stat.base_stat}</td>
          </tr>
        )
      })}
      </tbody>
      </table>
    </div>
  )
}
