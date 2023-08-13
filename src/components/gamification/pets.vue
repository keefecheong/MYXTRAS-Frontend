<template>
    <div id="pet" v-if="checkPage()">
        <div id="runner"></div>
    </div>
</template>

<style>
#pet {
    position: fixed;
    pointer-events: none;
    bottom: 0;
}
</style>

<script>
export default {
    props: ["enabled", "selectedPet"],
    data() {
        return {
            selectedChoice: null,
            selectedPet: null,
        };
    },
    created() {
        this.initData();
    },

    updated() {
        this.updatePet();
    },

    methods: {
        async initData() {
            // get user profile and follow status
            await fetch(
                `${
                    import.meta.env.VITE_APP_SERVER_URL
                }/api/gamification/gachapon`,
                {
                    methods: "GET",
                    credentials: "include",
                    mode: "cors",
                },
            )
                .then(async (res) => {
                    await res.json().then((data) => {
                        this.selectedChoice = data.pets.enabled;
                        this.selectedPet = data.chosenPetData;
                        this.changeRunner();
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        checkPage() {
            const currentPage =
                import.meta.env.VITE_BASE_URL +
                ":" +
                import.meta.env.VITE_PORT +
                "/gachapon.html";
            if (window.location.href == currentPage) {
                return this.enabled;
            }
            return this.enabled || this.selectedChoice;
        },

        changeRunner() {
            // create a new style element
            const styleElement = document.createElement("style");
            // assign it an id
            styleElement.id = "dynamic-style";
            // append it to the head of the document
            document.head.appendChild(styleElement);
            // create a string variable that contains the CSS code for the runner and the keyframes
            const runnerCSS = `
                #pet{
                    position: fixed;
                    bottom: 0;
                }

                #runner{
                    background: url("${this.selectedPet.sprite_sheet_link}");
                    width: ${
                        this.selectedPet.width / this.selectedPet.number / 3
                    }px;
                    height: ${this.selectedPet.height / 3}px;
                    animation: walk 10s steps(${
                        this.selectedPet.number
                    }) infinite;
                    background-size: ${this.selectedPet.width / 3}px ${
                        this.selectedPet.height / 3
                    }px;
                } 

                @keyframes walk {
                    0% {
                        background-position: 0px;
                        transform: translateX(0) scaleX(1);
                    }
                    49.999999999999% {
                        background-position: ${this.selectedPet.width}px;
                        transform: translateX(1325px) scaleX(1);
                    }
                    50% {
                        background-position: ${this.selectedPet.width}px;
                        transform: translateX(1325px) scaleX(-1);
                    }
                    100% {
                        background-position: 0px;
                        transform: translateX(0) scaleX(-1);
                    }
                }
            `;
            // append the runnerCSS string to the style element
            styleElement.appendChild(document.createTextNode(runnerCSS));
        },

        async updatePet() {
            // get user profile and follow status
            await fetch(
                `${
                    import.meta.env.VITE_APP_SERVER_URL
                }/api/gamification/gachapon`,
                {
                    methods: "GET",
                    credentials: "include",
                    mode: "cors",
                },
            )
                .then(async (res) => {
                    await res.json().then((data) => {
                        this.selectedPet = data.chosenPetData;
                        this.changeRunner();
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};
</script>
