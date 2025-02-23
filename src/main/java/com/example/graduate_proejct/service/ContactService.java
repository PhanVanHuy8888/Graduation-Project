package com.example.graduate_proejct.service;

import com.example.graduate_proejct.entity.Contact;
import com.example.graduate_proejct.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;

    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public Contact getContactById(Integer id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Contact updateContact(Integer id, Contact contactDetails) {
        Contact contact = getContactById(id);
        contact.setFullName(contactDetails.getFullName());
        contact.setEmail(contactDetails.getEmail());
        contact.setPhoneNumber(contactDetails.getPhoneNumber());
        contact.setMessage(contactDetails.getMessage());
        return contactRepository.save(contact);
    }

    public void deleteContact(Integer id) {
        contactRepository.deleteById(id);
    }
}

