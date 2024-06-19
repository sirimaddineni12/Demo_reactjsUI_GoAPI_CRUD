package main

import (
	"fmt"
	"os"
)

func main() {
	var n int
	t1 := 0
	t2 := 1
	nextTerm := 0

	defer handlePanic()

	fmt.Print("Enter the number of terms : ")
	err := fmt.Scan(&n)
	if err != nil {
		fmt.Println("Error reading input:", err)
		os.Exit(1)
	}

	fmt.Print("Fibonacci Series :")
	for i := 1; i <= n; i++ {
		if i == 1 {
			fmt.Print(" ", t1)
			continue
		}
		if i == 2 {
			fmt.Print(" ", t2)
			continue
		}
		nextTerm = t1 + t2
		t1 = t2
		t2 = nextTerm
		fmt.Print(" ", nextTerm)
	}
}

func handlePanic() {
	if r := recover(); r != nil {
		fmt.Println("Recovered from panic:", r)
	}
}
