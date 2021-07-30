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
                        cyan--text
                        text--accent-3
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
                        :rules="[
                          (v) =>
                            !!v ||
                            'Cette opération est impossible sans email...',
                          (v) => /.+@.+/.test(v) || 'Vite un café !!',
                        ]"
                        required
                        color="cyan accent-3"
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
                <v-col cols="12" md="4" class="cyan accent-3">
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
                        teal--text
                        text--accent-3
                      "
                    >
                      Connexion
                    </h1>
                  </v-card-title>
                  <v-card-subtitle class="mt-4">
                    <div class="text-center">
                      <v-btn class="mx-2" fab color="black" outlined>
                        <v-icon>fab fa-facebook-f</v-icon>
                      </v-btn>

                      <v-btn class="mx-2" fab color="black" outlined>
                        <v-icon>fab fa-google-plus-g</v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab color="black" outlined>
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
                        :rules="[
                          (v) =>
                            !!v ||
                            'Sans email impossible de vous identifier...',
                          (v) => /.+@.+/.test(v) || 'Vite un café !!',
                        ]"
                        required
                        color="teal accent-3"
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
                        color="teal accent-3"
                      />
                    </v-form>
                    <h3 class="text-center mt-4">
                      <a @click="step = 0">Mot de passe oublié ?</a>
                    </h3>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-btn
                      rounded
                      color="teal accent-3"
                      dark
                      :disabled="!isValid"
                      class="px-5 mb-3"
                      @click.prevent="login"
                      >Connexion</v-btn
                    >
                  </v-card-actions>
                </v-col>
                <v-col cols="12" md="4" class="teal accent-3">
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
                  class="teal accent-3"
                  order="1"
                  order-md="0"
                >
                  <v-card-text class="white--text mt-12">
                    <h1 class="text-center display-1">Welcome Back!</h1>
                    <h5 class="text-center">
                      Identifiez-vous et partageons nos idées
                    </h5>
                  </v-card-text>
                  <div class="text-center">
                    <v-btn rounded outlined dark @click="step--" class="mb-3"
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
                        teal--text
                        text--accent-3
                      "
                    >
                      Inscription
                    </h1>
                  </v-card-title>
                  <v-card-subtitle class="mt-4">
                    <div class="text-center">
                      <v-btn class="mx-2" fab color="black" outlined>
                        <v-icon>fab fa-facebook-f</v-icon>
                      </v-btn>

                      <v-btn class="mx-2" fab color="black" outlined>
                        <v-icon>fab fa-google-plus-g</v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab color="black" outlined>
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
                        color="teal accent-3"
                      />
                      <v-text-field
                        label="Email"
                        name="email"
                        v-model="email"
                        prepend-icon="email"
                        type="text"
                        color="teal accent-3"
                      />
                      <v-text-field
                        id="password"
                        label="Mot de passe"
                        name="password"
                        v-model="password"
                        prepend-icon="lock"
                        type="password"
                        color="teal accent-3"
                      />
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-btn
                      rounded
                      color="teal accent-3"
                      dark
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
    errorMessage: null,
    isValid: true,
    message: null,
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
        this.message = response.data.message;
        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);
        this.$router.push("/posts");
      } catch (error) {
        this.errorMessage = error.response.data.error;
        // A voir ici un bottomSheet
        setTimeout(() => {
          this.errorMessage = "";
        }, 1500);
      }
    },
    async login() {
      try {
        const response = await Auth.login({
          email: this.email,
          password: this.password,
        });
        this.message = response.data.message;
        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);
        this.$router.push("/posts");
      } catch (error) {
        this.errorMessage = error.response.data.error;
        setTimeout(() => {
          this.email = "";
          this.password = "";
          this.errorMessage = "";
        }, 1500);
      }
    },
  },
  beforeCreate() {
    if (this.$store.state.isLoggedIn) {this.$router.push('/posts')} 
  }
};
</script>