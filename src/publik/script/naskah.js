class EndpointLoader {
	constructor(linksContainerId, apiEndpoint) {
		this.linksContainer = document.getElementById(linksContainerId);
		this.apiEndpoint = apiEndpoint;

		this.init();
	}

	init() {
		this.loadEndpoints();
		// setInterval(() => this.loadEndpoints(), 1000);
	}

	loadEndpoints() {
		fetch(this.apiEndpoint)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Error loading endpoints");
				}
				return response.json();
			})
			.then((endpoints) => {
				this.linksContainer.innerHTML = "";

				endpoints.forEach((endpoint) => {
					const link = document.createElement("a");
					link.href = endpoint.path;
					link.textContent = `${endpoint.methods.join(", ")}: ${
						endpoint.path
					}`;

					this.linksContainer.appendChild(link);
					this.linksContainer.appendChild(
						document.createElement("br")
					);
				});
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}
}

document.addEventListener("DOMContentLoaded", () => {
	new EndpointLoader("links-container", "/api/routes");
});
