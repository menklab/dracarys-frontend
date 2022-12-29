interface secretMsgBody {
  message: string;
}

// TODO: replace origin to nest_host env var when backend dev is ready
export default async function getMsg(origin: string) {
  console.log("res3");
  // const res = await axios.get(origin + "/api/auth/requestMessage", { withCredentials: true });

  // .then(res => {
  //   const persons = res.data;
  //   // this.setState({ persons });
  // })

  const res = await fetch(origin + "/api/auth/requestMessage", {
    credentials: "include",
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  console.log("res", res);
  if (!res.ok) throw new Error(await res.text());

  return (await res.json()) as secretMsgBody;
}
