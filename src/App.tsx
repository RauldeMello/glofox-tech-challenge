import React, { useEffect, useState } from "react";
import moment, { Moment } from "moment";

import logo from "./abc-glofox-logo.png";
import "./App.css";

type Staff = {
  createdAt: string;
  id: string;
  name: string;
  type: "trainer" | "receptionist" | "admin";
};

type StaffAPIResponse = Staff[];

type Trainer = Staff & {
  type: "trainer";
};

type AppointmentAPIRequestBody = {
  name: string;
  email: string;
  dateTime: string;
  trainerId: Trainer["id"];
};

const STAFF_ENDPOINT = "https://64df526f71c3335b25826fcc.mockapi.io/trainers";
const APPOINTMENT_ENDPOINT =
  "https://64df526f71c3335b25826fcc.mockapi.io/appointment";

function toMoment(x: string): string {
  const date = moment(x);
  if (date.isValid()) {
    return date.format("YYYY-MM-DD");
  }
  throw new Error("computer says no");
}

const config = {
  name: {
    id: "name",
    name: "name",
    type: "name",
    minLength: 1,
    maxLength: 10,
    required: true,
  },
  email: {
    id: "email",
    name: "email",
    type: "email",
    minLength: 5,
    maxLength: 100,
    required: true,
  },
  dateTime: {
    id: "dateTime",
    name: "dateTime",
    type: "datetime-local",
    min: "1900-01-01",
    max: "2005-31-12",
    required: true,
  },
  trainer: {
    id: "trainer",
    name: "trainer",
    type: "select",
    options: [],
  },
};

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [trainers, setTrainers] = useState<Staff[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState<
    string | undefined
  >(undefined);

  console.log(name);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data: AppointmentAPIRequestBody = {
      name,
      email,
      dateTime: toMoment(date),
      trainerId: selectedTrainerId!,
    };
    console.log(data);
    const response = await fetch(APPOINTMENT_ENDPOINT, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    console.log(await response.json());
  }

  async function fetchTrainers() {
    const data: any = await fetch(STAFF_ENDPOINT);
    const jsonData = await data.json();
    const trainers = jsonData.filter(
      (staffMember: Staff) => staffMember.type === "trainer"
    );
    console.log(trainers);
    setTrainers(trainers);
  }

  useEffect(() => {
    fetchTrainers();
  }, []);

  return (
    <div className="App">
      <header className="app__header">
        <img src={logo} className="ApP--logo" alt="logo" />
      </header>
      <main className="appmain">
        <div className="form-container">
          <h2>Raul's Form - Tech interview</h2>
          <form className="form" onSubmit={onSubmit}>
            <input
              className="input"
              value={name}
              {...config.name}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input"
              value={email}
              {...config.email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Date"
              className="input"
              value={date}
              {...config.dateTime}
              onChange={(e) => setDate(e.target.value)}
            />
            <select
              onChange={(e) => setSelectedTrainerId(e.target.value)}
              className="select"
              {...config.trainer}
            >
              <option value="Select a trainer">Select a trainer</option>
              {trainers.map((trainer) => (
                <option
                  key={trainer.id}
                  style={{ color: "black" }}
                  value={trainer.id}
                >
                  {trainer.name}
                </option>
              ))}
            </select>
            <button className="btn" type="submit">
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
