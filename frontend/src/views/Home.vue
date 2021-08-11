<template>
  <v-container
    class="fill-height"
    fluid
    align-content-xs-start
    align-content-mg-center
  >
    <v-row justify="center">
      <v-col sm="8">
        <v-card class="elevation-6">
          <v-window v-model="step">
            <v-window-item :value="0">
              <v-row>
                <v-col cols="12" md="8">
                  <v-card-title class="justify-center">
                    <h1
                      class="
                        mt-8
                        text-center
                        display-2
                        grey--text
                        text--lighten-1
                      "
                    >
                      Mot de passe oublié <br />¯\_(ツ)_/¯
                    </h1>
                  </v-card-title>
                  <v-card-subtitle class="mt-4">
                    <h4 class="text-center">
                      Nous allons vous renvoyer un lien pour redefinir votre mot
                      de passe
                    </h4>
                  </v-card-subtitle>
                  <v-card-text class="mt-16 mb-12">
                    <v-form v-model="isValid">
                      <v-text-field
                        label="Email"
                        name="email"
                        v-model="email"
                        prepend-icon="email"
                        type="email"
                        :rules="emailRules"
                        required
                        color="grey lighten-1"
                      />
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-btn
                      rounded
                      color="cyan accent-3"
                      dark
                      :disabled="!isValid"
                      class="px-5 mt-md-16 mb-3"
                      >Réinitialiser le mot de passe</v-btn
                    >
                  </v-card-actions>
                </v-col>
                <v-col cols="12" md="4" class="grey lighten-1">
                  <v-card-text class="white--text mt-mg-12">
                    <h1 class="text-center display-1">
                      Finally, i'm remember !!
                    </h1>
                    <h5 class="text-center">
                      Identifiez-vous et démarrons notre journée ensemble
                    </h5>
                  </v-card-text>
                  <div class="text-center">
                    <v-btn rounded outlined dark @click="step++" class="mb-3"
                      >Connexion</v-btn
                    >
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" md="8">
                  <v-card-title class="justify-center align-start">
                    <h1
                      class="
                        mt-8
                        text-center
                        display-2
                        indigo--text
                        text--darken-4
                      "
                    >
                      Connexion
                    </h1>
                  </v-card-title>
                  <v-card-subtitle class="mt-4">
                    <div class="text-center">
                      <v-btn
                        class="mx-2"
                        fab
                        color="black"
                        outlined
                        aria-label="Se connecter avec facebook"
                      >
                        <v-icon>fab fa-facebook-f</v-icon>
                      </v-btn>

                      <v-btn
                        class="mx-2"
                        fab
                        color="black"
                        outlined
                        aria-label="Se connecter avec google"
                      >
                        <v-icon>fab fa-google-plus-g</v-icon>
                      </v-btn>
                      <v-btn
                        class="mx-2"
                        fab
                        color="black"
                        outlined
                        aria-label="Se connecter avec linkedin"
                      >
                        <v-icon>fab fa-linkedin-in</v-icon>
                      </v-btn>
                    </div>
                    <h4 class="text-center mt-4">
                      Renseignez vos informations
                    </h4>
                  </v-card-subtitle>
                  <v-card-text class="mt-12">
                    <v-form v-model="isValid">
                      <v-text-field
                        label="Email"
                        name="email"
                        v-model="email"
                        prepend-icon="email"
                        type="email"
                        :rules="emailRules"
                        required
                        color="indigo darken-4"
                      />

                      <v-text-field
                        id="password"
                        label="Mot de passe"
                        name="password"
                        v-model="password"
                        prepend-icon="lock"
                        type="password"
                        :rules="[(v) => !!v || 'Ben alors !!!']"
                        required
                        color="indigo darken-4"
                      />
                    </v-form>
                    <h3 class="text-center mt-4">
                      <a class="indigo--text text--darken-4" @click="step = 0"
                        >Mot de passe oublié ?</a
                      >
                    </h3>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-btn
                      rounded
                      color="indigo darken-4"
                      dark
                      :disabled="!isValid"
                      class="px-5 mb-3"
                      @click.prevent="login"
                      >Connexion</v-btn
                    >
                  </v-card-actions>
                </v-col>
                <v-col cols="12" md="4" class="indigo darken-4">
                  <v-card-text class="white--text mt-12">
                    <h1 class="text-center display-1">Hello, Friend!</h1>
                    <h5 class="text-center">Rejoignez-nous dans l'aventure</h5>
                  </v-card-text>
                  <div class="text-center">
                    <v-btn rounded outlined dark @click="step++" class="mb-3"
                      >Inscription</v-btn
                    >
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="2">
              <v-row class="fill-height">
                <v-col
                  cols="12"
                  md="4"
                  class="red lighten-4"
                  order="1"
                  order-md="0"
                >
                  <v-card-text class="black--text mt-12">
                    <h1 class="text-center display-1">Welcome Back!</h1>
                    <h5 class="text-center">
                      Identifiez-vous et partageons nos idées
                    </h5>
                  </v-card-text>
                  <div class="text-center">
                    <v-btn rounded outlined @click="step--" class="mb-3"
                      >Connexion</v-btn
                    >
                  </div>
                </v-col>

                <v-col cols="12" md="8">
                  <v-card-title class="justify-center align-start">
                    <h1
                      class="
                        mt-8
                        text-center
                        display-2
                        red--text
                        text--lighten-4
                      "
                    >
                      Inscription
                    </h1>
                  </v-card-title>
                  <v-card-subtitle class="mt-4">
                    <div class="text-center">
                      <v-btn
                        class="mx-2"
                        fab
                        color="black"
                        outlined
                        aria-label="Se connecter avec facebook"
                      >
                        <v-icon>fab fa-facebook-f</v-icon>
                      </v-btn>

                      <v-btn
                        class="mx-2"
                        fab
                        color="black"
                        outlined
                        aria-label="Se connecter avec google"
                      >
                        <v-icon>fab fa-google-plus-g</v-icon>
                      </v-btn>
                      <v-btn
                        class="mx-2"
                        fab
                        color="black"
                        outlined
                        aria-label="Se connecter avec linkedin"
                      >
                        <v-icon>fab fa-linkedin-in</v-icon>
                      </v-btn>
                    </div>
                    <h4 class="text-center mt-4">
                      Renseignez vos informations
                    </h4>
                  </v-card-subtitle>
                  <v-card-text class="mt-4">
                    <v-form>
                      <v-text-field
                        label="Nom"
                        name="name"
                        v-model="name"
                        prepend-icon="person"
                        type="text"
                        color="red lighten-4"
                        required
                      />
                      <v-text-field
                        label="Email"
                        name="email"
                        v-model="email"
                        prepend-icon="email"
                        type="text"
                        color="red lighten-4"
                        :rules="emailRules"
                        required
                      />
                      <v-text-field
                        id="password"
                        label="Mot de passe"
                        name="password"
                        v-model="password"
                        prepend-icon="lock"
                        type="password"
                        color="red lighten-4"
                        :rules="passwordRules"
                        required
                      />
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-btn
                      rounded
                      color="red lighten-4"
                      class="px-5 mb-3"
                      @click.prevent="signup"
                    >
                      GO !!!
                    </v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script>
import Auth from "../services/Auth.js";

export default {
  data: () => ({
    step: 1,
    name: "",
    email: "",
    password: "",
    isValid: true,
    message: null,
    emailRules: [
      (v) => !!v || "Votre adresse doit être renseignée",
      (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "Votre adresse email est invalide",
    ],
    passwordRules: [
      (v) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          v
        ) ||
        "Le mot de passe doit contenir au moins 8 caractères (dont au moins une majuscule, une minuscule, un chiffre, un caractère spécial)",
    ],
  }),
  props: {
    source: String,
  },
  methods: {
    async signup() {
      try {
        const response = await Auth.signup({
          name: this.name,
          email: this.email,
          password: this.password,
        });
        this.$store.dispatch("setSnackBar", response);
        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);
        this.$router.push("/posts");
      } catch (error) {
        if (error.response.data.error) {
          this.$store.dispatch("setSnackBar", error);
        }
      }
    },
    async login() {
      try {
        const response = await Auth.login({
          email: this.email,
          password: this.password,
        });
        this.$store.dispatch("setSnackBar", response);
        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);
        this.$router.push("/posts");
      } catch (error) {
        if (error.response.data.error != {}) {
          this.$store.dispatch("setSnackBar", error);
          this.email = "";
          this.password = "";
        }
      }
    },
  },
  beforeCreate() {
    if (this.$store.state.isLogged) {
      this.$router.push("/posts");
    }
  },
};
</script>