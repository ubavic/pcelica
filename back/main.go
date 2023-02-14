package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"golang.org/x/exp/slices"
)

type reqJSON struct {
	Word string
}

type respJSON struct {
	Found string
}

func main() {
	dic, err := os.ReadFile("dic.json")
	if err != nil {
		panic(err)
	}

	var dictionary []string
	err = json.Unmarshal(dic, &dictionary)
	if err != nil {
		panic(err)
	}

	http.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		var request reqJSON
		var response respJSON

		body, err := ioutil.ReadAll(req.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err = json.Unmarshal(body, &request)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		fmt.Println(request.Word)

		if slices.Contains(dictionary, request.Word) {
			response = respJSON{Found: "true"}
		} else {
			response = respJSON{Found: "false"}
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(response)

	})

	fmt.Printf("Starting on :9991")
	http.ListenAndServe(":9991", nil)

}
