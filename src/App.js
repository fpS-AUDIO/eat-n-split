import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);

  function handleShowHideAddFriend() {
    setShowAddFriendForm((showFriend) => !showFriend);
  }

  function handleAddFriend(newFriend) {
    // update state by creating new array
    setFriends((actualFriends) => [...actualFriends, newFriend]);

    // also close the <FormAddFriend>
    setShowAddFriendForm(false);
  }

  function handleSelectedFriend(selectFriend) {
    setSelectedFriend(selectFriend);

    // also close the <FormAddFriend>
    setShowAddFriendForm(false);
  }

  function handleUpdateBalance(value) {
    setFriends((actualFriends) =>
      actualFriends.map((friend) => {
        return friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend;
      })
    );

    // also close the <FormSplitBill />
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={handleSelectedFriend}
        />
        {showAddFriendForm && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowHideAddFriend}>
          {showAddFriendForm ? `Close` : `Add Friend`}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onUpdateBalance={handleUpdateBalance}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  return (
    // dinamically change the className (check if id is the same)
    <li className={selectedFriend?.id === friend.id ? `selected` : ``}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>

      {/* if negative balance */}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {/* if positive balance */}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}$
        </p>
      )}

      {/* if balance is 0 */}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelectFriend(friend)}>
        {selectedFriend?.id === friend.id ? `Close` : `Select`}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  // state for controlled elements (inputs of form)
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");

  function handleSubmitForm(e) {
    // preventing default behavior of html forms
    e.preventDefault();

    // creating random id
    const id = crypto.randomUUID();

    // guard clause
    if (!name || !img) return;

    // creating new friend object
    const newFriend = {
      name,
      image: `${img}?=${id}`,
      balance: 0,
      id,
    };

    // updating lifted up state
    onAddFriend(newFriend);

    // reset the form to initial state
    setName("");
    setImg("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmitForm}>
      <label>Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image URL</label>
      <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onUpdateBalance }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  // check if bill is set, overwise return nothing
  const friendExpense = bill ? bill - userExpense : "";
  const [whoPays, setWhoPays] = useState("user");

  function handleSubmitForm(e) {
    e.preventDefault();
    if (!bill || !userExpense) return;

    if (whoPays === "friend") onUpdateBalance(-userExpense);
    if (whoPays === "user") onUpdateBalance(friendExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmitForm}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>Bill Value:</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label>Your Expense:</label>
      <input
        type="number"
        value={userExpense}
        onChange={(e) =>
          // check if the value is not bigger then the bill itself
          setUserExpense(+e.target.value > bill ? bill : +e.target.value)
        }
      />

      <label>{selectedFriend.name} Expense:</label>
      <input type="text" disabled value={friendExpense} />

      <label>Who is paying the bill?</label>
      <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
