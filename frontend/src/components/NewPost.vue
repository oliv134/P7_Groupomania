<template>
  <v-container
    fluid
    align-content-xs-start
    align-content-mg-center
    class="mt-8"
  >
    <v-row justify="center">
      <v-col cols="11" md="6">
        <v-card class="elevation-6">
          <v-row>
            <v-col cols="2" md="1" class="text-center px-0">
              <v-avatar color="indigo">
                <span
                  class="white--text headline"
                  v-if="!$store.state.user.imageSrc"
                >
                  {{ $store.state.user.initial }}
                </span>
                <v-img
                  v-if="$store.state.user.imageSrc"
                  src="$store.state.user.imageSrc"
                  alt="John"
                  height="30"
                  max-width="30"
                  contain
                >
                </v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10" md="11" class="grey lighten-5 px-md-6 px-3">
              <v-form
                ref="postForm"
                @submit.prevent="onSubmit"
                enctype="multipart/form-data"
                class="validate"
              >
                <v-textarea
                  label="Que souhaitez-vous partager ?"
                  ref="contentInput"
                  auto-grow
                  outlined
                  rows="1"
                  v-model="content"
                  :rules="[rules.required]"
                  class="input-group--focused"
                >
                </v-textarea>
                <v-img
                  class="rounded-lg"
                  max-height="300"
                  :src="imageUrl"
                  v-if="imageUrl"
                ></v-img>
                <v-row class="">
                  <v-col class="" cols="2" sm="1">
                    <v-btn icon @click="addImage" v-if="!imageUrl">
                      <v-icon>mdi-image</v-icon>
                    </v-btn>
                    <v-btn icon @click="delImage" v-if="imageUrl">
                      <v-icon color="red">mdi-image-off-outline</v-icon>
                    </v-btn>
                  </v-col>

                  <v-col class="" cols="2" sm="1">
                    <v-btn icon>
                      <v-icon>mdi-gif</v-icon>
                    </v-btn>
                    <input
                      ref="file"
                      class="d-none"
                      type="file"
                      accept="image/png, image/jpeg, image/bmp, image/gif"
                      @change="onFileChanged"
                    />
                  </v-col>
                </v-row>
                <v-divider class="mb-2"></v-divider>
                <v-row justify="end">
                  <v-col cols="2">
                    <v-btn color="deep-purple" @click="cancelMod" v-if="imageUrl || content"> Annuler </v-btn>
                  </v-col>
                  <v-col cols="3">
                    <v-btn class="" color="info" @click="onSubmit">
                      {{ validText }}
                      <template v-slot:loader>
                        <span class="custom-loader">
                          <v-icon light>mdi-cached</v-icon>
                        </span>
                      </template>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    content: null,
    isSelecting: false,
    rules: {
      required: (value) =>
        !!value || "Il faut quand même écrire quelque chose.",
    },
    imageSrc: null,
    imageUrl: null,
  }),
  props: {
    postId: {
      type: Number,
    },
    update: {
      type: Boolean,
    },
    upContent: {
      type: String,
    },
    upImageUrl: {
      type: String,
    },
  },
  methods: {
    addImage() {
      this.$refs.file.click();
    },
    delImage() {
      this.imageSrc = null;
      this.imageUrl = null;
    },
    onFileChanged() {
      this.imageSrc = this.$refs.file.files[0];
      this.imageUrl = URL.createObjectURL(this.imageSrc);
      // do something
    },
    onSubmit() {
      const formData = new FormData();
      formData.append("content", this.content);

      if (this.update) {
        formData.append("imageUrl", this.imageUrl);
        formData.append("image", this.imageSrc);
        this.$store
          .dispatch("updatePost", { postId: this.postId, formData: formData })
          .then(this.$emit("updatePost"));
      } else {
        if (this.imageSrc) {
          formData.append("image", this.imageSrc);
        }
        this.$store.dispatch("createPost", formData).then();
        this.delImage();
        this.$refs.postForm.reset();
        
      }
    },
    cancelMod() {
      this.delImage();
      this.$refs.postForm.reset()
      this.$emit("updatePost");
    }
  },
  computed: {
    validText() {
      return this.update ? "Mettre à jour" : "Poster";
    },
  },
  beforeMount() {
    if (this.update) {
      this.content = this.upContent;
      this.imageUrl = this.upImageUrl === "null" ? null : this.upImageUrl;
      this.$refs.contentInput.focus();
    }
  },
};
</script>
