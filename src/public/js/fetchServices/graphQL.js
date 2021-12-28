const fetchGraphQL = async (body, jwt) => {
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    if (jwt) {
        headers["Authorization"] = `Bearer ${jwt}`;
    }

    const response = await fetch("/graphql", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    return await response.json();
}

export default fetchGraphQL;