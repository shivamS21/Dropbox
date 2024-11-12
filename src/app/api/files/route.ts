export async function GET(request: Request) {
    const [name, email] = ["shivam sharma", "shivamsha2100@gmail.com"];
    return new Response(JSON.stringify({name, email}), {
        headers: {
            "Content-Type": "application/json"
        },
        status: 200
    })
}