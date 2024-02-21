import React, { useEffect, useState } from 'react';
import './FoodList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { formatDate, getImageUrl } from './utils';

function FoodList() {
    const isLoggedIn = localStorage.getItem('apiKey') !== null;
    const [food, setFood] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedFoodItem, setEditedFoodItem] = useState({});
    const [deleteMessage, setDeleteMessage] = useState('');
    const [activeCategory, setActiveCategory] = useState('Alla');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchItem, setSearchItem] = useState('');

    const startEditing = (foodItem) => {                                                    // Om användaren klickar på edit så kommer den här funktionen att köras 
        setEditingId(foodItem.id);                                                          // Sätter editingId till matvarans id 
        setEditedFoodItem({ ...foodItem });                                                 // Sätter editedFoodItem till matvaran som ska ändras                       
    };
    const handleInputChange = async (e) => {                                                // const som hanterar ändringar i matvaran                  
        setEditedFoodItem({ ...editedFoodItem, [e.target.name]: e.target.value });          // Sätter editedFoodItem till matvaran som ska ändras
    };
    const cancelEditing = () => {
        setEditingId(null);
    };
    // Sorterar matvaror efter kategori, namn, pris, vikt, beskrivning, utgångsdatum och datum tillagt
    const sortFood = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);

        setFood([...food].sort((a, b) => {
            if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
            return 0;
        }));
    };
    // När användaren klickar på save skickas en PUT request till servern
    const handleSort = (field) => () => sortFood(field);
    const handleEdit = async (id) => {
        const apiKey = localStorage.getItem('apiKey');
        console.log('API Key in handleEdit:', apiKey);
        try {
            const response = await fetch(`http://localhost:5000/food/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
                body: JSON.stringify(editedFoodItem),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setFood(
                food.map((foodItem) => (foodItem.id === id ? editedFoodItem : foodItem))
            );
            setEditingId({});
        } catch (error) {
            console.log(error);
        }
        setEditingId(null);
    }  
    // Raderar matvara 
    const handleDelete = async (id) => {
        const apiKey = localStorage.getItem('apiKey');                                    // Hämtar API-nyckeln från local storage
        console.log('API Key in handleDelete:', apiKey);
        const confirmed = window.confirm('Är du säker på att du vill ta bort matvaran?'); // Ger användaren möjligen att bekräfta att den vill radera matvaran

        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:5000/food/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'x-api-key': apiKey,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const foodItemToDelete = food.find((foodItem) => foodItem.id === id);
                const foodItemName = foodItemToDelete ? foodItemToDelete.name : 'Okänd matvara';

                setFood(food.filter((foodItem) => foodItem.id !== id));
                setDeleteMessage(`${foodItemName} har raderats.`);
                // Sätter en timeout på 3 sekunder
                setTimeout(() => {
                    setDeleteMessage('');
                }, 3000);
            } catch (error) {
                console.log(error);
            }
        }
    };
    // Hämtar matvaror från servern
    useEffect(() => {
        fetch('http://localhost:5000/food')
            .then((response) => response.json())
            .then((data) => {
                setFood(data);
                console.log(data);
            })
            .catch((error) => console.log(error));
    }, []);
    // Filtrerar matvaror efter kategori och sökning
    const filteredItems = food.filter(item => {
        const matchesCategory = activeCategory === 'Alla' || item.category === activeCategory;
        const matchesSearch = searchItem.trim() === '' || item.name.toLowerCase().includes(searchItem.toLowerCase()) ||
            item.description.toLowerCase().includes(searchItem.toLowerCase()) ||
            item.category.toLowerCase().includes(searchItem.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    return (
        <div className="container">
            {deleteMessage && <div className="alert alert-success">{deleteMessage}</div>}
            <select className="form-select m-3" value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
                {['Alla', ...new Set(food.map(item => item.category))].map(category => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>
            <input
                type="text"
                className="form-control m-3"
                placeholder="Search"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
            />
            {filteredItems.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th onClick={handleSort('category')} className="sortable">
                                Category
                                <FontAwesomeIcon icon={faChevronDown} />
                            </th>
                            <th>Image</th>
                            <th onClick={handleSort('name')} className="sortable">
                                Name
                                <FontAwesomeIcon icon={faChevronDown} />
                            </th>
                            <th onClick={handleSort('price')} className="sortable">
                                Price
                                <FontAwesomeIcon icon={faChevronDown} />
                            </th>
                            <th>Weight</th>
                            <th onClick={handleSort('description')} className="sortable"
                            >Description
                                <FontAwesomeIcon icon={faChevronDown} /></th>
                            <th onClick={handleSort('expirationDate')} className="sortable">
                                Expiration Date
                                <FontAwesomeIcon icon={faChevronDown} /></th>
                            <th onClick={handleSort('dateAdded')} className="sortable">
                                Date Added
                                <FontAwesomeIcon icon={faChevronDown} /></th>
                            {isLoggedIn && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                    {filteredItems.map((item) => (
                        <tr key={item.id} className={editingId === item.id ? 'editing' : 'food-item'}>
                            {editingId === item.id ? (
                                // Redigeringsvy
                                <> 
                                 <td>
                                        <select name="category" value={editedFoodItem.category || ''} onChange={handleInputChange}>
                                        <option value="Dryck">Dryck</option>
                                                <option value="Soppa">Soppa</option>
                                                <option value="Frukt">Frukt</option>
                                                <option value="Grönsaker">Grönsaker</option>
                                                <option value="Kött">Kött</option>
                                                <option value="Fisk">Fisk</option>
                                                <option value="Mejeri">Mejeri</option>
                                                <option value="Bröd">Bröd</option>
                                                <option value="Annat">Annat</option>
                                        </select>
                                    </td>
                                 <td><img src={getImageUrl(item.imageUrl)} className='food-item-image' alt="food" /></td>
                                    <td><input type="text" name="name" value={editedFoodItem.name || ''} onChange={handleInputChange} /></td>
                                    <td><input type="text" name="price" value={editedFoodItem.price || ''} onChange={handleInputChange} /></td>
                                    <td><input type="text" name="weight" value={editedFoodItem.weight || ''} onChange={handleInputChange} /></td>
                                    <td><input type="text" name="description" value={editedFoodItem.description || ''} onChange={handleInputChange} /></td>
                                    <td><input type="date" name="ExpirationDate" value={editedFoodItem.ExpirationDate || ''} onChange={handleInputChange} /></td>
                                    <td><input type="date" name="dateAdded" value={editedFoodItem.dateAdded || ''} onChange={handleInputChange} /></td>
                                    <td>
                                        <button className="btn btn-success" onClick={() => handleEdit(item.id)}>Save</button>
                                        <button className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
                                    </td>
                                  
                                </>
                            ) : (
                                <>
                                <td data-label="Category:">{item.category}</td>
                            <td><img src={getImageUrl(item.imageUrl)} className='food-item-image' alt="food" /></td>
                                    <td data-label="Name:">{item.name}</td>
                                    <td data-label="Price:">{item.price}</td>
                                    <td data-label="Weight:">{item.weight}</td>
                                    <td data-label="Description:">{item.description}</td>
                                    <td data-label="Expires:">{formatDate(item.ExpirationDate)}</td>
                                    <td data-label="Added:">{formatDate(item.dateAdded)}</td>
                                    {isLoggedIn && (
                                        <td>
                                            <button className="btn btn-primary" onClick={() => startEditing(item)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                        </td>
                                    )}
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <div>Inga matvaror matchar din sökning.</div>
            )}
        </div>
    );
}

export default FoodList;