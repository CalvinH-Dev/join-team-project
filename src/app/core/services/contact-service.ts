import { inject, Injectable, Injector, OnDestroy, runInInjectionContext } from "@angular/core";
import { DocumentData } from "@angular/fire/compat/firestore";
import {
	collection,
	collectionData,
	doc,
	Firestore,
	onSnapshot,
	QuerySnapshot,
} from "@angular/fire/firestore";
import { Contact } from "../interfaces/contact";

type ContactDictionary = Record<string, Contact[]>;

@Injectable({
	providedIn: "root",
})
export class ContactService {

}
