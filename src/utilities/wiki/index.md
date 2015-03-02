# index.md

## preliminaries
```
# ssh + keyed auth
sudo apt-get install openssh-server 

sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
sudo vi /etc/ssh/sshd_config
# remove password authentication
# PasswordAuthentication no
vi ~/.ssh/authorized_keys
# add public keys to file

sudo restart ssh
```



## Remote Desktop
```
# server
sudo apt-get install xrdp
/etc/init.d/xrdp start
# sudo adduser <USERNAME> && sudo adduser <USERNAME> sudo

# client
sudo apt-get install rdesktop
```


## Virtualbox
```
sudo vi /etc/apt/sources.list
# deb http://download.virtualbox.org/virtualbox/debian trusty contrib
wget -q https://www.virtualbox.org/download/oracle_vbox.asc -O- | sudo apt-key add -

sudo apt-get update
sudo apt-get install virtualbox-4.3

# or dpkg -i ....deb
vboxmanage --version

# error
modprobe vboxdrv
```

--bioslogofadein off
--bioslogodisplaytime 10000 # 10 sec
setproperty loghistorycount=1


### logging
```
# https://www.virtualbox.org/wiki/VBoxLogging

VBoxManage debugvm "ubuntu" log --release +dev_vga.e.l.f
VBoxManage debugvm "ubuntu" log --release -dev_vmm_backdoor.restrict
VBoxManage debugvm "ubuntu" logdest --debug stdout
VBoxManage debugvm "ubuntu" logflags --release buffered

VBoxManage debugvm "ubuntu" show logdbg-settings
                    VBOX_LOG=
              VBOX_LOG_FLAGS=
               VBOX_LOG_DEST=



export VBOX_RELEASE_LOG="rem*.e.l.f main gui"
export VBOX_RELEASE_LOG_FLAGS="buffered thread msprog"
# Do not limit the number of log entries a guest can send to the release log
export VBOX_RELEASE_LOG=-dev_vmm_backdoor.restrict

export VBOX_LOG="dev_vmm.e"
export VBOX_LOG="rt_ldr.e.f"
export VBOX_LOG_FLAGS="msprog"
export VBOX_LOG_DEST="nofile stderr"

export VBOX_LOG_DEST="dir=/tmp"

```

### extension packs
```
vboxmanage list extpacks
sudo vboxmanage extpack install ./Oracle_VM_VirtualBox_Extension_Pack-4.3.22-98236.vbox-extpack
sudo vboxmanage extpack uninstall "Oracle VM VirtualBox Extension Pack"
# choose
vboxmanage setproperty vrdeextpack VNC
vboxmanage setproperty vrdeextpack "Oracle VM VirtualBox Extension Pack"
```

### create hdd
```
vboxmanage list hdds
vboxmanage storageattach "ubuntu" --storagectl "IDE Controller" --port 0 --device 0 --type hdd --medium none
vboxmanage closemedium disk 12bf137e-019b-4df4-bf34-e48ee73e49ae --delete
```

### create box
```
vboxmanage list vms
vboxmanage list runningvms

vboxmanage list ostypes | egrep -nir ubuntu
vboxmanage createvm --name "ubuntu" -ostype Ubuntu_64 --register

vboxmanage modifyvm "ubuntu" --memory 512 --acpi on --nic1 nat
vboxmanage createhd --filename "ubuntu_disk.vdi" --size 20000
vboxmanage storagectl "ubuntu" --name "IDE Controller" --add ide --controller PIIX4
vboxmanage storageattach "ubuntu" --storagectl "IDE Controller" --port 0 --device 0 --type hdd --medium "ubuntu_disk.vdi"
vboxmanage storageattach "ubuntu" --storagectl "IDE Controller" --port 0 --device 1 --type dvddrive --medium ./ubuntu-14.04.2-desktop-amd64.iso
vboxmanage storageattach "ubuntu" --storagectl "IDE Controller" --port 0 --device 1 --type dvddrive --medium ./xubuntu-14.04-desktop-amd64.iso
vboxmanage storageattach "ubuntu" --storagectl "IDE Controller" --port 0 --device 1 --type dvddrive --medium /usr/share/virtualbox/VBoxGuestAdditions.iso 
vboxmanage storageattach "ubuntu" --storagectl "IDE Controller" --port 0 --device 1 --type dvddrive --medium none
vboxmanage modifyvm "ubuntu" --clipboard bidirectional

vboxmanage modifyvm "ubuntu" --vrde on # 3389
vboxmanage modifyvm "ubuntu" --vrdeport 5000

# simple password auth
VBoxManage internalcommands passwordhash "<password>"

VBoxManage setproperty vrdeauthlibrary "VBoxAuthSimple"
VBoxManage modifyvm "ubuntu" --vrdeauthtype external
VBoxManage setextradata "ubuntu" "VBoxAuthSimple/users/<user>" <hash>
1a964013d37a467f6eb2615618b5b88ce6f65b06fa511c1b6f98820a28e63d6e

# involved auth:
https://www.virtualbox.org/manual/ch07.html
users/phoebe" 

# starting
vboxmanage showvminfo "ubuntu"

vboxheadless --startvm "ubuntu"
vboxmanage startvm "ubuntu" --type=headless

vboxmanage controlvm "ubuntu" acpipowerbutton
vboxmanage controlvm "ubuntu" poweroff # plug

# deleting
vboxmanage unregistervm "ubuntu" --delete

```

## port forward for ssh
```
VBoxManage modifyvm "ubuntu" --natpf1 "ssh,tcp,,3022,,22"
ssh -p 3022 john@127.0.0.1 # from host
```
## dynamic networking
```
vboxmanage modifyvm "ubuntu" --nic1 bridged
vboxmanage modifyvm "ubuntu" --bridgeadapter1 eth0
ssh john@192.168.1.10 # from anywhere
```


## box in box
```
vboxmanage modifyvm "ubuntu" --hwvirtex on --vtxvpid on --vtxux on
vboxmanage modifyvm "ubuntu" --firmware bios
VBoxManage modifyvm "ubuntu" --bioslogodisplaytime 10000
```


### client visuals
```
rdesktop -a 16 -N localhost:3389
rdesktop localhost:3389
rdesktop localhost:5000
```


## DIY
```
https://www.virtualbox.org/wiki/Linux%20build%20instructions
```


## Vagrant
```
# https://www.vagrantup.com/downloads.html
wget https://dl.bintray.com/mitchellh/vagrant/vagrant_1.7.2_x86_64.deb
sudo dpkg -i ./vagrant_1.7.2_x86_64.deb
# http://docs.vagrantup.com/v2/getting-started/index.html
vagrant init hashicorp/precise32 --debug

# stop
vagrant halt


```










